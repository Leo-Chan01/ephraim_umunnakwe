import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/admin_provider.dart';
import '../models/portfolio_data.dart';

class SocialLinksScreen extends StatefulWidget {
  const SocialLinksScreen({Key? key}) : super(key: key);

  @override
  State<SocialLinksScreen> createState() => _SocialLinksScreenState();
}

class _SocialLinksScreenState extends State<SocialLinksScreen> {
  final Map<String, IconData> _platformIcons = {
    'github': Icons.code,
    'linkedin': Icons.business,
    'twitter': Icons.alternate_email,
    'instagram': Icons.camera_alt,
    'facebook': Icons.facebook,
    'email': Icons.email,
    'website': Icons.language,
    'youtube': Icons.play_circle_outline,
    'medium': Icons.article,
    'dribbble': Icons.brush,
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Manage Social Links'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showAddLinkDialog(context),
            tooltip: 'Add Social Link',
          ),
        ],
      ),
      body: Consumer<AdminProvider>(
        builder: (context, provider, child) {
          if (provider.socialLinks.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.link, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No social links yet', style: TextStyle(fontSize: 18)),
                  SizedBox(height: 8),
                  Text('Tap the + button to add your first social link'),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: provider.socialLinks.length,
            itemBuilder: (context, index) {
              final link = provider.socialLinks[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor:
                        Theme.of(context).primaryColor.withOpacity(0.1),
                    child: Icon(
                      _platformIcons[link.platform.toLowerCase()] ?? Icons.link,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  title: Text(
                    link.platform.toUpperCase(),
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  subtitle: Text(
                    link.url,
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Switch(
                        value: link.isVisible,
                        onChanged: (value) {
                          provider.toggleSocialLinkVisibility(link.platform);
                        },
                      ),
                      PopupMenuButton<String>(
                        onSelected: (value) {
                          switch (value) {
                            case 'edit':
                              _showEditLinkDialog(context, link);
                              break;
                            case 'delete':
                              _deleteLink(context, link);
                              break;
                          }
                        },
                        itemBuilder: (context) => [
                          const PopupMenuItem(
                            value: 'edit',
                            child: Row(
                              children: [
                                Icon(Icons.edit, size: 18),
                                SizedBox(width: 8),
                                Text('Edit'),
                              ],
                            ),
                          ),
                          const PopupMenuItem(
                            value: 'delete',
                            child: Row(
                              children: [
                                Icon(Icons.delete, size: 18, color: Colors.red),
                                SizedBox(width: 8),
                                Text('Delete',
                                    style: TextStyle(color: Colors.red)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  void _showAddLinkDialog(BuildContext context) {
    final platformController = TextEditingController();
    final urlController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Social Link'),
        content: SizedBox(
          width: 400,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(
                  labelText: 'Platform',
                  hintText: 'Select platform',
                ),
                items: _platformIcons.keys.map((platform) {
                  return DropdownMenuItem(
                    value: platform,
                    child: Row(
                      children: [
                        Icon(_platformIcons[platform], size: 20),
                        const SizedBox(width: 8),
                        Text(platform.toUpperCase()),
                      ],
                    ),
                  );
                }).toList(),
                onChanged: (value) {
                  platformController.text = value ?? '';
                },
              ),
              const SizedBox(height: 16),
              TextField(
                controller: urlController,
                decoration: const InputDecoration(
                  labelText: 'URL',
                  hintText: 'https://example.com/yourprofile',
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (platformController.text.isNotEmpty &&
                  urlController.text.isNotEmpty) {
                Provider.of<AdminProvider>(context, listen: false)
                    .updateSocialLink(
                        platformController.text, urlController.text);
                Navigator.of(context).pop();
              }
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  void _showEditLinkDialog(BuildContext context, SocialLink link) {
    final urlController = TextEditingController(text: link.url);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Edit ${link.platform.toUpperCase()} Link'),
        content: SizedBox(
          width: 400,
          child: TextField(
            controller: urlController,
            decoration: const InputDecoration(
              labelText: 'URL',
              hintText: 'https://example.com/yourprofile',
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (urlController.text.isNotEmpty) {
                Provider.of<AdminProvider>(context, listen: false)
                    .updateSocialLink(link.platform, urlController.text);
                Navigator.of(context).pop();
              }
            },
            child: const Text('Update'),
          ),
        ],
      ),
    );
  }

  void _deleteLink(BuildContext context, SocialLink link) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Social Link'),
        content: Text(
            'Are you sure you want to delete your ${link.platform.toUpperCase()} link?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Provider.of<AdminProvider>(context, listen: false)
                  .deleteSocialLink(link.platform);
              Navigator.of(context).pop();
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
