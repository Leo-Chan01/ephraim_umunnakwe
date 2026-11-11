-- Rebuild + redeploy the static site whenever a blog post changes, so the
-- link-preview tags (og:image, og:title, ...) baked into each post's HTML stay current.
--
-- Fires a GitHub `repository_dispatch` (event_type: blog-updated), which runs
-- .github/workflows/deploy-nextjs.yml.
--
-- Setup (run once in the Supabase SQL editor):
--   1. Create a fine-grained GitHub token: repo Leo-Chan01/ephraim_umunnakwe,
--      permission "Contents: Read and write".
--   2. Store it in Vault (never commit it):
--        select vault.create_secret('<YOUR_GITHUB_TOKEN>', 'github_dispatch_token');
--   3. Run the rest of this file.
--
-- Equivalent no-SQL option: Dashboard > Database > Webhooks > blog_posts
-- (Insert/Update/Delete) > HTTP POST to the URL below with the same headers/body.

create extension if not exists pg_net;

create or replace function public.trigger_site_redeploy()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  token text;
begin
  -- Drafts that stay unpublished don't affect the public site
  if tg_op = 'UPDATE' and not coalesce(new.is_published, false) and not coalesce(old.is_published, false) then
    return null;
  end if;
  if tg_op = 'INSERT' and not coalesce(new.is_published, false) then
    return null;
  end if;

  select decrypted_secret into token
  from vault.decrypted_secrets
  where name = 'github_dispatch_token'
  limit 1;

  if token is null then
    raise warning 'trigger_site_redeploy: github_dispatch_token not found in vault';
    return null;
  end if;

  perform net.http_post(
    url := 'https://api.github.com/repos/Leo-Chan01/ephraim_umunnakwe/dispatches',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || token,
      'Accept', 'application/vnd.github+json',
      'Content-Type', 'application/json',
      'User-Agent', 'supabase-redeploy'
    ),
    body := jsonb_build_object('event_type', 'blog-updated')
  );

  return null;
end;
$$;

drop trigger if exists blog_posts_redeploy on public.blog_posts;
create trigger blog_posts_redeploy
after insert or update or delete on public.blog_posts
for each row execute function public.trigger_site_redeploy();
