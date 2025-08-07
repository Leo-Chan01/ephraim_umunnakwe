import 'package:ephraim_umunnakwe/theme/colors.dart';
import 'package:ephraim_umunnakwe/utils/util_methods.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:animated_text_kit/animated_text_kit.dart';

class ModernFooter extends StatelessWidget {
  final bool isDesktop;
  const ModernFooter({super.key, required this.isDesktop});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: isDesktop ? 40 : 20,
        vertical: 60,
      ),
      child: Column(
        children: [
          // Main Footer Content
          isDesktop
              ? _buildDesktopFooter(context)
              : _buildMobileFooter(context),

          const SizedBox(height: 40),

          // Divider
          Container(
            height: 1,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.transparent,
                  AppColors.textMuted.withOpacity(0.5),
                  Colors.transparent,
                ],
              ),
            ),
          ),

          const SizedBox(height: 30),

          // Bottom Bar
          _buildBottomBar(context),
        ],
      ),
    );
  }

  Widget _buildDesktopFooter(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // About Section
        Expanded(
          flex: 2,
          child: _buildAboutSection(context),
        ),

        const SizedBox(width: 60),

        // Quick Links
        Expanded(
          child: _buildQuickLinks(context),
        ),

        const SizedBox(width: 60),

        // Contact Info
        Expanded(
          child: _buildContactInfo(context),
        ),

        const SizedBox(width: 60),

        // Social Links
        Expanded(
          child: _buildSocialLinks(context),
        ),
      ],
    );
  }

  Widget _buildMobileFooter(BuildContext context) {
    return Column(
      children: [
        _buildAboutSection(context),
        const SizedBox(height: 40),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: _buildQuickLinks(context)),
            const SizedBox(width: 40),
            Expanded(child: _buildContactInfo(context)),
          ],
        ),
        const SizedBox(height: 40),
        _buildSocialLinks(context),
      ],
    );
  }

  Widget _buildAboutSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Logo/Brand
        Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                gradient: AppGradients.buttonGradient,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primaryBlue.withOpacity(0.3),
                    blurRadius: 15,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: const Icon(
                FontAwesomeIcons.code,
                color: Colors.white,
                size: 24,
              ),
            ),
            const SizedBox(width: 15),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'King Raym',
                  style: Theme.of(context).textTheme.titleLarge!.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                ShaderMask(
                  shaderCallback: (bounds) =>
                      AppGradients.accentGradient.createShader(bounds),
                  child: Text(
                    'Flutter Developer',
                    style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                        ),
                  ),
                ),
              ],
            ),
          ],
        ),

        const SizedBox(height: 20),

        // Animated tagline
        SizedBox(
          height: 60,
          child: DefaultTextStyle(
            style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                  height: 1.6,
                ),
            child: AnimatedTextKit(
              animatedTexts: [
                TypewriterAnimatedText(
                  'Transforming ideas into beautiful, functional mobile applications.',
                  speed: const Duration(milliseconds: 50),
                ),
                TypewriterAnimatedText(
                  'Building the future, one line of code at a time.',
                  speed: const Duration(milliseconds: 50),
                ),
                TypewriterAnimatedText(
                  'Passionate about Flutter, innovation, and creating digital experiences.',
                  speed: const Duration(milliseconds: 50),
                ),
              ],
              isRepeatingAnimation: true,
              pause: const Duration(seconds: 3),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildQuickLinks(BuildContext context) {
    final links = [
      {'label': 'About Me', 'action': () {}},
      {'label': 'My Projects', 'action': () {}},
      {'label': 'Hire Me', 'action': () {}},
      {'label': 'Blog Posts', 'action': () {}},
      {'label': 'Resume', 'action': () {}},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Links',
          style: Theme.of(context).textTheme.titleMedium!.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 20),
        ...links.map((link) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: MouseRegion(
                cursor: SystemMouseCursors.click,
                child: GestureDetector(
                  onTap: link['action'] as VoidCallback,
                  child: Text(
                    link['label'] as String,
                    style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                          color: AppColors.textSecondary,
                        ),
                  ),
                ),
              ),
            )),
      ],
    );
  }

  Widget _buildContactInfo(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Get In Touch',
          style: Theme.of(context).textTheme.titleMedium!.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 20),
        _buildContactItem(
          context,
          FontAwesomeIcons.envelope,
          'ephraimleo16@gmail.com',
          () => openLink('mailto:ephraimleo16@gmail.com'),
        ),
        const SizedBox(height: 12),
        _buildContactItem(
          context,
          FontAwesomeIcons.phone,
          '+234 811 636 9105',
          () => openLink('tel:+2348116369105'),
        ),
        const SizedBox(height: 12),
        _buildContactItem(
          context,
          FontAwesomeIcons.locationDot,
          'Imo State, Nigeria',
          () {},
        ),
      ],
    );
  }

  Widget _buildContactItem(
    BuildContext context,
    IconData icon,
    String text,
    VoidCallback onTap,
  ) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: onTap,
        child: Row(
          children: [
            Icon(
              icon,
              size: 16,
              color: AppColors.accentOrange,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                text,
                style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                      color: AppColors.textSecondary,
                    ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSocialLinks(BuildContext context) {
    final socialLinks = [
      {
        'icon': FontAwesomeIcons.xTwitter,
        'label': 'Twitter',
        'url': 'https://x.com/yfdtweets',
        'color': const Color(0xFF1DA1F2),
      },
      {
        'icon': FontAwesomeIcons.instagram,
        'label': 'Instagram',
        'url': 'https://instagram.com/your.favourite.developer',
        'color': const Color(0xFFE4405F),
      },
      {
        'icon': FontAwesomeIcons.linkedinIn,
        'label': 'LinkedIn',
        'url': 'https://linkedin.com/in/ephraim-umunnakwe',
        'color': const Color(0xFF0077B5),
      },
      {
        'icon': FontAwesomeIcons.github,
        'label': 'GitHub',
        'url': 'https://github.com/ephraim-umunnakwe',
        'color': const Color(0xFF333333),
      },
      {
        'icon': FontAwesomeIcons.hashnode,
        'label': 'Hashnode',
        'url': 'https://kingraym.hashnode.dev/',
        'color': const Color(0xFF2962FF),
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Follow Me',
          style: Theme.of(context).textTheme.titleMedium!.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 20),
        Wrap(
          spacing: isDesktop ? 15 : 20,
          runSpacing: 15,
          children: socialLinks.map((social) {
            return _buildSocialButton(
              social['icon'] as IconData,
              social['label'] as String,
              social['url'] as String,
              social['color'] as Color,
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildSocialButton(
      IconData icon, String label, String url, Color color) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: () => openLink(url),
        child: Container(
          width: isDesktop ? 50 : 60,
          height: isDesktop ? 50 : 60,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                color.withOpacity(0.2),
                color.withOpacity(0.1),
              ],
            ),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: color.withOpacity(0.3),
              width: 1,
            ),
          ),
          child: Icon(
            icon,
            color: color,
            size: isDesktop ? 20 : 24,
          ),
        ),
      ),
    );
  }

  Widget _buildBottomBar(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          '© 2025 Ephraim Umunnakwe. All rights reserved.',
          style: Theme.of(context).textTheme.bodySmall!.copyWith(
                color: AppColors.textMuted,
              ),
        ),
        if (isDesktop) ...[
          Row(
            children: [
              Text(
                'Made with ',
                style: Theme.of(context).textTheme.bodySmall!.copyWith(
                      color: AppColors.textMuted,
                    ),
              ),
              const Icon(
                FontAwesomeIcons.heart,
                color: Colors.red,
                size: 14,
              ),
              Text(
                ' and Flutter',
                style: Theme.of(context).textTheme.bodySmall!.copyWith(
                      color: AppColors.textMuted,
                    ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}
