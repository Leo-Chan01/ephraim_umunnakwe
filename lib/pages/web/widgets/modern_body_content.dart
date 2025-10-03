import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:avatar_glow/avatar_glow.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/glass_card.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/modern_feature_card.dart';
import 'package:ephraim_umunnakwe/pages/web/routes/app_routes.dart';
import 'package:ephraim_umunnakwe/theme/colors.dart';
import 'package:ephraim_umunnakwe/utils/list_utility.dart';
import 'package:ephraim_umunnakwe/view_models/providers/site_state_provider.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:ephraim_umunnakwe/view_models/providers/projects_provider.dart';
import 'package:ephraim_umunnakwe/models/testimonial_model.dart';

class ModernBodyContent extends StatefulWidget {
  final bool isDesktop;
  const ModernBodyContent({super.key, required this.isDesktop});

  @override
  State<ModernBodyContent> createState() => _ModernBodyContentState();
}

class _ModernBodyContentState extends State<ModernBodyContent>
    with TickerProviderStateMixin {
  late AnimationController _heroController;
  late AnimationController _statsController;
  late Animation<double> _heroFadeAnimation;
  late Animation<double> _heroSlideAnimation;
  late Animation<double> _statsAnimation;

  @override
  void initState() {
    super.initState();

    _heroController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _statsController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );

    // Load portfolio data when the widget initializes
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      try {
        await Provider.of<PortfolioDataProvider>(context, listen: false)
            .loadAll();
      } catch (e) {
        // Error handling is done in the provider
        debugPrint('Error loading portfolio data in ModernBodyContent: $e');
      }
    });

    _heroFadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _heroController,
      curve: Curves.easeOutCubic,
    ));

    _heroSlideAnimation = Tween<double>(
      begin: 50.0,
      end: 0.0,
    ).animate(CurvedAnimation(
      parent: _heroController,
      curve: Curves.easeOutBack,
    ));

    _statsAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _statsController,
      curve: Curves.elasticOut,
    ));

    // Start animations
    _heroController.forward();
    Future.delayed(const Duration(milliseconds: 800), () {
      _statsController.forward();
    });
  }

  @override
  void dispose() {
    _heroController.dispose();
    _statsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<SiteStateProvider>(
      builder: (context, siteState, child) {
        return Padding(
          padding: EdgeInsets.symmetric(
            horizontal: widget.isDesktop ? 40 : 20,
            vertical: 20,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Hero Section
              _buildHeroSection(context),

              const SizedBox(height: 80),

              // Call to Action Section
              _buildCallToActionSection(context),

              const SizedBox(height: 100),

              // Stats Section
              _buildStatsSection(context),

              const SizedBox(height: 100),

              // Brand Promise Section
              _buildBrandPromiseSection(context, siteState),

              const SizedBox(height: 100),

              // Testimonials Section
              _buildTestimonialsSection(context),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHeroSection(BuildContext context) {
    return AnimatedBuilder(
      animation: _heroController,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _heroSlideAnimation.value),
          child: Opacity(
            opacity: _heroFadeAnimation.value,
            child: Column(
              children: [
                // Profile Avatar with Glow
                AvatarGlow(
                  glowColor: AppColors.accentGold,
                  duration: const Duration(milliseconds: 2000),
                  repeat: true,
                  child: CircleAvatar(
                    radius: widget.isDesktop ? 80 : 60,
                    backgroundColor: AppColors.cardGlass,
                    child: CircleAvatar(
                      radius: widget.isDesktop ? 75 : 55,
                      backgroundImage:
                          const AssetImage('assets/images/profile_img.jpg'),
                    ),
                  ),
                ),

                const SizedBox(height: 30),

                // Animated Introduction
                SizedBox(
                  width: double.infinity,
                  child: Column(
                    children: [
                      // Main greeting with animation
                      DefaultTextStyle(
                        style:
                            Theme.of(context).textTheme.headlineLarge!.copyWith(
                                  fontSize: widget.isDesktop ? 48 : 32,
                                  fontWeight: FontWeight.bold,
                                ),
                        child: AnimatedTextKit(
                          animatedTexts: [
                            WavyAnimatedText('Hello, I\'m King Raym'),
                            WavyAnimatedText('Flutter Developer'),
                            WavyAnimatedText('Tech Innovator'),
                          ],
                          isRepeatingAnimation: true,
                          pause: const Duration(seconds: 2),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Description
                      Container(
                        constraints: BoxConstraints(
                          maxWidth: widget.isDesktop ? 700 : double.infinity,
                        ),
                        child: Text(
                          'I transform ideas into beautiful, functional mobile applications. '
                          'With expertise in Flutter and a passion for innovation, I create '
                          'digital experiences that make a difference.',
                          textAlign: TextAlign.center,
                          style:
                              Theme.of(context).textTheme.bodyLarge!.copyWith(
                                    height: 1.8,
                                    fontSize: widget.isDesktop ? 18 : 16,
                                  ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildCallToActionSection(BuildContext context) {
    return GlassCard(
      child: Column(
        children: [
          ShaderMask(
            shaderCallback: (bounds) =>
                AppGradients.accentGradient.createShader(bounds),
            child: Text(
              'Ready to Get Started?',
              style: Theme.of(context).textTheme.headlineMedium!.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
            ),
          ),

          const SizedBox(height: 20),

          Text(
            'Let\'s bring your ideas to life with cutting-edge technology',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyLarge,
          ),

          const SizedBox(height: 30),

          // Action Buttons
          widget.isDesktop
              ? Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    GlassButton(
                      text: 'View My Work',
                      icon: FontAwesomeIcons.code,
                      color: AppColors.primaryBlue,
                      size: const Size(180, 50),
                      onPressed: () => context.push(AppRoutes.myAppsPage),
                    ),
                    const SizedBox(width: 20),
                    GlassButton(
                      text: 'Hire Me',
                      icon: FontAwesomeIcons.handshake,
                      color: AppColors.accentOrange,
                      size: const Size(150, 50),
                      onPressed: () => context.push(AppRoutes.hireMe),
                    ),
                    const SizedBox(width: 20),
                    GlassButton(
                      text: 'About Me',
                      icon: FontAwesomeIcons.user,
                      isOutlined: true,
                      size: const Size(150, 50),
                      onPressed: () => context.push(AppRoutes.aboutMe),
                    ),
                  ],
                )
              : Column(
                  children: [
                    GlassButton(
                      text: 'View My Work',
                      icon: FontAwesomeIcons.code,
                      color: AppColors.primaryBlue,
                      size: const Size(250, 50),
                      onPressed: () => context.push(AppRoutes.myAppsPage),
                    ),
                    const SizedBox(height: 15),
                    GlassButton(
                      text: 'Hire Me',
                      icon: FontAwesomeIcons.handshake,
                      color: AppColors.accentOrange,
                      size: const Size(250, 50),
                      onPressed: () => context.push(AppRoutes.hireMe),
                    ),
                    const SizedBox(height: 15),
                    GlassButton(
                      text: 'About Me',
                      icon: FontAwesomeIcons.user,
                      isOutlined: true,
                      size: const Size(250, 50),
                      onPressed: () => context.push(AppRoutes.aboutMe),
                    ),
                  ],
                ),
        ],
      ),
    );
  }

  Widget _buildStatsSection(BuildContext context) {
    final stats = [
      {
        'title': 'Happy Clients',
        'value': '50+',
        'icon': FontAwesomeIcons.smile,
        'color': AppColors.success,
      },
      {
        'title': 'Companies',
        'value': '6+',
        'icon': FontAwesomeIcons.building,
        'color': AppColors.primaryBlue,
      },
      {
        'title': 'Live Projects',
        'value': '12+',
        'icon': FontAwesomeIcons.rocket,
        'color': AppColors.accentOrange,
      },
      {
        'title': 'Years Experience',
        'value': '8+',
        'icon': FontAwesomeIcons.calendar,
        'color': AppColors.primaryPurple,
      },
    ];

    return AnimatedBuilder(
      animation: _statsAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _statsAnimation.value,
          child: Column(
            children: [
              Text(
                'Achievements & Milestones',
                style: Theme.of(context).textTheme.headlineMedium!.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 40),
              widget.isDesktop
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: stats
                          .map((stat) => StatsCard(
                                title: stat['title'] as String,
                                value: stat['value'] as String,
                                icon: stat['icon'] as IconData,
                                color: stat['color'] as Color,
                              ))
                          .toList(),
                    )
                  : Wrap(
                      spacing: 20,
                      runSpacing: 20,
                      alignment: WrapAlignment.center,
                      children: stats
                          .map((stat) => StatsCard(
                                title: stat['title'] as String,
                                value: stat['value'] as String,
                                icon: stat['icon'] as IconData,
                                color: stat['color'] as Color,
                              ))
                          .toList(),
                    ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildBrandPromiseSection(
      BuildContext context, SiteStateProvider siteState) {
    return Column(
      children: [
        Text(
          'What I Offer',
          style: Theme.of(context).textTheme.headlineMedium!.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 20),
        Text(
          'Comprehensive solutions tailored to your needs',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        const SizedBox(height: 50),
        widget.isDesktop
            ? Wrap(
                spacing: 30,
                runSpacing: 30,
                alignment: WrapAlignment.center,
                children: brandPromiseList.asMap().entries.map((entry) {
                  final index = entry.key;
                  final promise = entry.value;

                  return MouseRegion(
                    onEnter: (event) {
                      siteState.updateHoveringState(true, promise.id,
                          index: index);
                    },
                    onExit: (event) {
                      siteState.updateHoveringState(false, promise.id,
                          index: index);
                    },
                    child: FeatureCard(
                      icon: promise.prandPromiseIcon,
                      title: promise.title,
                      description: promise.subTitle,
                      isFocused: siteState.isHovering,
                      accentColor: _getAccentColor(index),
                    ),
                  );
                }).toList(),
              )
            : Column(
                children: brandPromiseList.asMap().entries.map((entry) {
                  final index = entry.key;
                  final promise = entry.value;

                  return MouseRegion(
                    onEnter: (event) {
                      siteState.updateHoveringState(true, promise.id,
                          index: index);
                    },
                    onExit: (event) {
                      siteState.updateHoveringState(false, promise.id,
                          index: index);
                    },
                    child: FeatureCard(
                      icon: promise.prandPromiseIcon,
                      title: promise.title,
                      description: promise.subTitle,
                      isFocused: siteState.isHovering,
                      shouldExpand: true,
                      accentColor: _getAccentColor(index),
                    ),
                  );
                }).toList(),
              ),
      ],
    );
  }

  Widget _buildTestimonialsSection(BuildContext context) {
    final portfolioProvider = Provider.of<PortfolioDataProvider>(context);
    final testimonials = portfolioProvider.testimonials;
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(FontAwesomeIcons.quoteLeft,
                  color: AppColors.accentOrange, size: 24),
              const SizedBox(width: 12),
              Text(
                'What People Say',
                style: Theme.of(context).textTheme.headlineSmall!.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const Spacer(),
              if (testimonials.isNotEmpty)
                Text(
                  '${testimonials.length} testimonials',
                  style: Theme.of(context)
                      .textTheme
                      .bodySmall!
                      .copyWith(color: AppColors.textMuted),
                ),
            ],
          ),
          const SizedBox(height: 24),
          if (portfolioProvider.isLoading)
            const SizedBox(
              height: 160,
              child: Center(
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation(AppColors.primaryBlue),
                ),
              ),
            )
          else if (testimonials.isEmpty)
            Container(
              height: 160,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                gradient: AppGradients.cardGradient,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.textMuted.withOpacity(0.2)),
              ),
              child: Text(
                'No testimonials yet',
                style: Theme.of(context)
                    .textTheme
                    .bodyLarge!
                    .copyWith(color: AppColors.textMuted),
              ),
            )
          else
            SizedBox(
              height: 200,
              child: PageView.builder(
                controller: PageController(viewportFraction: 0.9),
                itemCount: testimonials.length,
                itemBuilder: (context, index) {
                  final t = testimonials[index];
                  return Padding(
                    padding: const EdgeInsets.only(right: 16.0),
                    child: _TestimonialCard(testimonial: t),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }

  Color _getAccentColor(int index) {
    final colors = [
      AppColors.primaryBlue,
      AppColors.accentOrange,
      AppColors.success,
      AppColors.primaryPurple,
      AppColors.accentTeal,
    ];
    return colors[index % colors.length];
  }
}

class _TestimonialCard extends StatelessWidget {
  final Testimonial testimonial;
  const _TestimonialCard({required this.testimonial});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.textMuted.withOpacity(0.15)),
        gradient: LinearGradient(
          colors: [
            AppColors.cardGlass.withOpacity(0.4),
            AppColors.cardGlass.withOpacity(0.15)
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 22,
                backgroundColor: AppColors.primaryBlue.withOpacity(0.2),
                backgroundImage: (testimonial.avatarUrl != null &&
                        testimonial.avatarUrl!.isNotEmpty)
                    ? NetworkImage(testimonial.avatarUrl!)
                    : null,
                child: (testimonial.avatarUrl == null ||
                        testimonial.avatarUrl!.isEmpty)
                    ? Text(
                        testimonial.author.substring(0, 1).toUpperCase(),
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      )
                    : null,
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(testimonial.author,
                        style: Theme.of(context)
                            .textTheme
                            .titleMedium!
                            .copyWith(fontWeight: FontWeight.bold)),
                    Text(testimonial.role,
                        style: Theme.of(context)
                            .textTheme
                            .bodySmall!
                            .copyWith(color: AppColors.textMuted)),
                  ],
                ),
              ),
              _RatingStars(rating: testimonial.rating),
            ],
          ),
          const SizedBox(height: 14),
          Expanded(
            child: Text(
              '“${testimonial.message}”',
              style: Theme.of(context)
                  .textTheme
                  .bodyMedium!
                  .copyWith(height: 1.4, color: AppColors.textSecondary),
              maxLines: 4,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            _timeAgo(testimonial.createdAt),
            style: Theme.of(context)
                .textTheme
                .bodySmall!
                .copyWith(color: AppColors.textMuted, fontSize: 11),
          ),
        ],
      ),
    );
  }

  String _timeAgo(DateTime date) {
    final diff = DateTime.now().difference(date);
    if (diff.inDays >= 365) return '${(diff.inDays / 365).floor()}y ago';
    if (diff.inDays >= 30) return '${(diff.inDays / 30).floor()}mo ago';
    if (diff.inDays >= 7) return '${(diff.inDays / 7).floor()}w ago';
    if (diff.inDays >= 1) return '${diff.inDays}d ago';
    if (diff.inHours >= 1) return '${diff.inHours}h ago';
    if (diff.inMinutes >= 1) return '${diff.inMinutes}m ago';
    return 'just now';
  }
}

class _RatingStars extends StatelessWidget {
  final double rating;
  const _RatingStars({required this.rating});
  @override
  Widget build(BuildContext context) {
    final full = rating.floor();
    final half = (rating - full) >= 0.5;
    return Row(
      children: [
        for (var i = 0; i < full; i++)
          const Icon(Icons.star, size: 14, color: Colors.amber),
        if (half) const Icon(Icons.star_half, size: 14, color: Colors.amber),
        for (var i = 0; i < (5 - full - (half ? 1 : 0)); i++)
          const Icon(Icons.star_border, size: 14, color: Colors.amber),
      ],
    );
  }
}
