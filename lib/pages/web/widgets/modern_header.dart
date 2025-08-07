import 'package:ephraim_umunnakwe/pages/web/widgets/glass_card.dart';
import 'package:ephraim_umunnakwe/pages/web/routes/app_routes.dart';
import 'package:ephraim_umunnakwe/theme/colors.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:animated_text_kit/animated_text_kit.dart';

class ModernHeader extends StatelessWidget {
  final bool isDesktop;
  const ModernHeader({super.key, required this.isDesktop});

  static final reviewMessageCtrl = TextEditingController();
  static final reviewerNameCtrl = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: 20,
        vertical: isDesktop ? 30 : 20,
      ),
      child: isDesktop
          ? _buildDesktopHeader(context)
          : _buildMobileHeader(context),
    );
  }

  Widget _buildDesktopHeader(BuildContext context) {
    return Row(
      children: [
        // Logo/Avatar Section
        _buildAvatarSection(context),

        const Spacer(),

        // Navigation Menu
        _buildNavigationMenu(context),

        const SizedBox(width: 30),

        // Action Buttons
        _buildActionButtons(context),
      ],
    );
  }

  Widget _buildMobileHeader(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            _buildAvatarSection(context),
            const Spacer(),
            _buildMobileMenu(context),
          ],
        ),
        const SizedBox(height: 20),
        _buildMobileNavigation(context),
      ],
    );
  }

  Widget _buildAvatarSection(BuildContext context) {
    return Row(
      children: [
        // Enhanced Avatar with Glow
        Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: AppColors.accentGold.withOpacity(0.3),
                blurRadius: 20,
                spreadRadius: 2,
              ),
            ],
          ),
          child: CircleAvatar(
            radius: isDesktop ? 35 : 30,
            backgroundColor: AppColors.cardGlass,
            child: CircleAvatar(
              radius: isDesktop ? 32 : 27,
              backgroundImage:
                  const AssetImage('assets/images/profile_img.jpg'),
            ),
          ),
        ),

        const SizedBox(width: 16),

        // Name and Title with Animation
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Animated Name
            SizedBox(
              width: isDesktop ? 300 : 200,
              child: DefaultTextStyle(
                style: TextStyle(
                  fontSize: isDesktop ? 28 : 20,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Avenir',
                  color: AppColors.textPrimary,
                ),
                child: AnimatedTextKit(
                  animatedTexts: [
                    TyperAnimatedText(
                      'Ephraim Umunnakwe',
                      speed: const Duration(milliseconds: 100),
                    ),
                    TyperAnimatedText(
                      'King Raym',
                      speed: const Duration(milliseconds: 100),
                    ),
                  ],
                  repeatForever: true,
                  pause: const Duration(seconds: 2),
                ),
              ),
            ),

            const SizedBox(height: 4),

            // Professional Title with Gradient
            ShaderMask(
              shaderCallback: (bounds) =>
                  AppGradients.accentGradient.createShader(bounds),
              child: Text(
                'Flutter Developer & Tech Innovator',
                style: TextStyle(
                  fontSize: isDesktop ? 16 : 12,
                  fontWeight: FontWeight.w500,
                  color: Colors.white,
                  fontFamily: 'Genome',
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildNavigationMenu(BuildContext context) {
    final menuItems = [
      {'label': 'Home', 'route': AppRoutes.homePage},
      {'label': 'About', 'route': AppRoutes.aboutMe},
      {'label': 'Projects', 'route': AppRoutes.myAppsPage},
      {'label': 'Hire Me', 'route': AppRoutes.hireMe},
    ];

    return GlassCard(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      borderRadius: 25,
      child: Row(
        children: menuItems.map((item) {
          return _buildNavItem(
            context,
            item['label']!,
            item['route']!,
          );
        }).toList(),
      ),
    );
  }

  Widget _buildNavItem(BuildContext context, String label, String route) {
    final currentRoute = GoRouterState.of(context).uri.path;
    final isActive = currentRoute == route;

    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: () => context.push(route),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          margin: const EdgeInsets.symmetric(horizontal: 4),
          decoration: BoxDecoration(
            gradient: isActive ? AppGradients.buttonGradient : null,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: isActive ? Colors.white : AppColors.textSecondary,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
              fontSize: 14,
              fontFamily: 'Avenir',
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Row(
      children: [
        // Review Button
        GlassButton(
          text: 'Write Review',
          icon: FontAwesomeIcons.star,
          size: const Size(140, 45),
          onPressed: () => _showReviewDialog(context),
        ),

        const SizedBox(width: 12),

        // Contact Button
        GlassButton(
          text: 'Contact',
          icon: FontAwesomeIcons.envelope,
          color: AppColors.accentOrange,
          size: const Size(120, 45),
          onPressed: () => context.push(AppRoutes.hireMe),
        ),
      ],
    );
  }

  Widget _buildMobileMenu(BuildContext context) {
    return GlassButton(
      text: 'Menu',
      icon: FontAwesomeIcons.bars,
      size: const Size(80, 40),
      onPressed: () => _showMobileMenu(context),
    );
  }

  Widget _buildMobileNavigation(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _buildMobileNavChip(
              context, 'Home', AppRoutes.homePage, FontAwesomeIcons.home),
          _buildMobileNavChip(
              context, 'About', AppRoutes.aboutMe, FontAwesomeIcons.user),
          _buildMobileNavChip(
              context, 'Projects', AppRoutes.myAppsPage, FontAwesomeIcons.code),
          _buildMobileNavChip(
              context, 'Hire', AppRoutes.hireMe, FontAwesomeIcons.handshake),
        ],
      ),
    );
  }

  Widget _buildMobileNavChip(
      BuildContext context, String label, String route, IconData icon) {
    final currentRoute = GoRouterState.of(context).uri.path;
    final isActive = currentRoute == route;

    return Container(
      margin: const EdgeInsets.only(right: 8),
      child: GlassButton(
        text: label,
        icon: icon,
        color: isActive ? AppColors.primaryBlue : AppColors.cardGlass,
        isOutlined: !isActive,
        size: const Size(100, 40),
        onPressed: () => context.push(route),
      ),
    );
  }

  void _showReviewDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: GlassCard(
          width: 500,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  const Icon(
                    FontAwesomeIcons.star,
                    color: AppColors.accentGold,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Write a Review',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon:
                        const Icon(Icons.close, color: AppColors.textSecondary),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              TextField(
                controller: reviewerNameCtrl,
                decoration: const InputDecoration(
                  labelText: 'Your Name',
                  prefixIcon: Icon(FontAwesomeIcons.user, size: 16),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: reviewMessageCtrl,
                maxLines: 4,
                decoration: const InputDecoration(
                  labelText: 'Your Review',
                  prefixIcon: Padding(
                    padding: EdgeInsets.only(bottom: 60),
                    child: Icon(FontAwesomeIcons.message, size: 16),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: GlassButton(
                      text: 'Cancel',
                      isOutlined: true,
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: GlassButton(
                      text: 'Submit',
                      color: AppColors.success,
                      onPressed: () {
                        // Handle review submission
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Thank you for your review!'),
                            backgroundColor: AppColors.success,
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showMobileMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => GlassCard(
        borderRadius: 25,
        margin: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildMobileMenuItem(
                context, 'Home', AppRoutes.homePage, FontAwesomeIcons.home),
            _buildMobileMenuItem(
                context, 'About Me', AppRoutes.aboutMe, FontAwesomeIcons.user),
            _buildMobileMenuItem(context, 'My Projects', AppRoutes.myAppsPage,
                FontAwesomeIcons.code),
            _buildMobileMenuItem(context, 'Hire Me', AppRoutes.hireMe,
                FontAwesomeIcons.handshake),
            const Divider(color: AppColors.textMuted),
            _buildMobileMenuItem(
              context,
              'Write Review',
              '',
              FontAwesomeIcons.star,
              onTap: () {
                Navigator.pop(context);
                _showReviewDialog(context);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMobileMenuItem(
    BuildContext context,
    String title,
    String route,
    IconData icon, {
    VoidCallback? onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: AppColors.textSecondary),
      title: Text(
        title,
        style: Theme.of(context).textTheme.bodyLarge,
      ),
      onTap: onTap ??
          () {
            Navigator.pop(context);
            if (route.isNotEmpty) {
              context.push(route);
            }
          },
    );
  }
}
