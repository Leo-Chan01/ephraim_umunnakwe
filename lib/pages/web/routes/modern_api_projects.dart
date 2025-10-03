import 'package:ephraim_umunnakwe/pages/web/widgets/glass_card.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/gradient_container.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/modern_footer.dart';
import 'package:ephraim_umunnakwe/pages/web/routes/app_routes.dart';
import 'package:ephraim_umunnakwe/theme/colors.dart';
import 'package:ephraim_umunnakwe/utils/responsive_util.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:animated_text_kit/animated_text_kit.dart';

class ModernApiProjects extends StatefulWidget {
  const ModernApiProjects({super.key});

  @override
  State<ModernApiProjects> createState() => _ModernApiProjectsState();
}

class _ModernApiProjectsState extends State<ModernApiProjects>
    with TickerProviderStateMixin {
  late AnimationController _headerController;
  late AnimationController _apisController;
  late Animation<double> _headerAnimation;
  late Animation<double> _apisAnimation;

  @override
  void initState() {
    super.initState();

    _headerController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _apisController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _headerAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _headerController,
      curve: Curves.easeOutCubic,
    ));

    _apisAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _apisController,
      curve: Curves.easeOutBack,
    ));

    // Start animations
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _headerController.forward();
      Future.delayed(const Duration(milliseconds: 500), () {
        _apisController.forward();
      });
    });
  }

  @override
  void dispose() {
    _headerController.dispose();
    _apisController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientContainer(
        includeStars: true,
        child: Stack(
          children: [
            SingleChildScrollView(
              child: Padding(
                padding: context.responsivePadding,
                child: Column(
                  children: [
                    const SizedBox(height: 100),

                    // Header Section
                    _buildHeaderSection(context),

                    const SizedBox(height: 60),

                    // APIs Grid
                    _buildApisSection(context),

                    const SizedBox(height: 80),

                    // Footer
                    ModernFooter(isDesktop: context.isDesktopOrLarger),
                  ],
                ),
              ),
            ),

            // Back Button
            _buildBackButton(context),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderSection(BuildContext context) {
    return AnimatedBuilder(
      animation: _headerAnimation,
      builder: (context, child) {
        return Opacity(
          opacity: _headerAnimation.value,
          child: Transform.translate(
            offset: Offset(0, 50 * (1 - _headerAnimation.value)),
            child: Column(
              children: [
                // Animated Title
                ShaderMask(
                  shaderCallback: (bounds) =>
                      AppGradients.accentGradient.createShader(bounds),
                  child: DefaultTextStyle(
                    style: Theme.of(context).textTheme.headlineLarge!.copyWith(
                          fontSize: ResponsiveUtil.getResponsiveFontSize(
                            context,
                            mobile: 28,
                            tablet: 36,
                            desktop: 48,
                            largeDesktop: 56,
                          ),
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                    child: AnimatedTextKit(
                      animatedTexts: [
                        WavyAnimatedText('API Projects'),
                        WavyAnimatedText('Web Services'),
                        WavyAnimatedText('Backend Solutions'),
                      ],
                      isRepeatingAnimation: true,
                      pause: const Duration(seconds: 2),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                Container(
                  constraints: BoxConstraints(
                    maxWidth: ResponsiveUtil.getResponsiveWidth(
                      context,
                      mobile: double.infinity,
                      tablet: 500,
                      desktop: 600,
                      largeDesktop: 700,
                    ),
                  ),
                  child: Text(
                    'Explore my collection of RESTful APIs, microservices, and backend solutions. '
                    'From authentication systems to data processing pipelines, these APIs power modern applications.',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.titleMedium!.copyWith(
                          color: AppColors.textSecondary,
                          height: 1.6,
                          fontSize: ResponsiveUtil.getResponsiveFontSize(
                            context,
                            mobile: 14,
                            tablet: 16,
                            desktop: 18,
                          ),
                        ),
                  ),
                ),

                const SizedBox(height: 30),

                // API Stats
                Wrap(
                  spacing: 20,
                  runSpacing: 10,
                  alignment: WrapAlignment.center,
                  children: [
                    _buildStatChip('8+', 'APIs', FontAwesomeIcons.server,
                        AppColors.primaryBlue),
                    _buildStatChip('99.9%', 'Uptime',
                        FontAwesomeIcons.checkCircle, AppColors.success),
                    _buildStatChip('1000+', 'Requests/Day',
                        FontAwesomeIcons.chartLine, AppColors.accentOrange),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatChip(
      String number, String label, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [color.withOpacity(0.2), color.withOpacity(0.1)],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 16),
          const SizedBox(width: 8),
          Column(
            children: [
              Text(
                number,
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              Text(
                label,
                style: const TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildApisSection(BuildContext context) {
    return AnimatedBuilder(
      animation: _apisAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _apisAnimation.value,
          child: Opacity(
            opacity: _apisAnimation.value,
            child: _buildApiGrid(context),
          ),
        );
      },
    );
  }

  Widget _buildApiGrid(BuildContext context) {
    final apis = _getSampleApis();

    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = ResponsiveUtil.getGridCrossAxisCount(
          context,
          mobile: 1,
          tablet: 2,
          desktop: 3,
          largeDesktop: 4,
        );

        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            crossAxisSpacing: 20,
            mainAxisSpacing: 20,
            childAspectRatio: ResponsiveUtil.responsive(
              context,
              mobile: 0.8,
              tablet: 0.9,
              desktop: 1.0,
              largeDesktop: 1.1,
            ),
          ),
          itemCount: apis.length,
          itemBuilder: (context, index) {
            return _buildApiCard(context, apis[index], index);
          },
        );
      },
    );
  }

  Widget _buildApiCard(
      BuildContext context, Map<String, dynamic> api, int index) {
    final statusColor = _getStatusColor(api['status']);

    return GlassCard(
      hasGlow: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // API Header
          Row(
            children: [
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  gradient: api['gradient'],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  api['icon'],
                  color: Colors.white,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      api['name'],
                      style: Theme.of(context).textTheme.titleLarge!.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      api['version'],
                      style: Theme.of(context).textTheme.bodySmall!.copyWith(
                            color: AppColors.textMuted,
                          ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  api['status'],
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // API Description
          Text(
            api['description'],
            style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                  color: AppColors.textSecondary,
                  height: 1.4,
                ),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),

          const SizedBox(height: 16),

          // API Metrics
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.cardGlass,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildMetric('Endpoints', api['endpoints'].toString(),
                    FontAwesomeIcons.route),
                _buildMetric(
                    'Uptime', api['uptime'], FontAwesomeIcons.chartLine),
                _buildMetric(
                    'Response', api['responseTime'], FontAwesomeIcons.clock),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Technologies
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: api['technologies'].map<Widget>((tech) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  gradient: AppGradients.buttonGradient,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  tech,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              );
            }).toList(),
          ),

          const Spacer(),

          // Action Buttons
          Row(
            children: [
              Expanded(
                child: GlassButton(
                  text: 'Documentation',
                  icon: FontAwesomeIcons.book,
                  size: const Size(double.infinity, 40),
                  isOutlined: true,
                  onPressed: () {},
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: GlassButton(
                  text: 'Try API',
                  icon: FontAwesomeIcons.play,
                  size: const Size(double.infinity, 40),
                  onPressed: () {},
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetric(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: AppColors.primaryBlue, size: 16),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 12,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textMuted,
            fontSize: 10,
          ),
        ),
      ],
    );
  }

  Widget _buildBackButton(BuildContext context) {
    return Positioned(
      top: 50,
      left: 20,
      child: GlassButton(
        text: 'Back',
        icon: FontAwesomeIcons.arrowLeft,
        size: const Size(100, 45),
        isOutlined: true,
        onPressed: () => context.push(AppRoutes.homePage),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'active':
        return AppColors.success;
      case 'development':
        return AppColors.accentOrange;
      case 'maintenance':
        return AppColors.warning;
      case 'deprecated':
        return AppColors.error;
      default:
        return AppColors.textMuted;
    }
  }

  List<Map<String, dynamic>> _getSampleApis() {
    return [
      {
        'name': 'User Authentication API',
        'version': 'v2.1.0',
        'status': 'Active',
        'description':
            'Secure authentication system with JWT tokens, OAuth integration, and multi-factor authentication support.',
        'endpoints': 12,
        'uptime': '99.9%',
        'responseTime': '45ms',
        'technologies': ['Node.js', 'JWT', 'OAuth', 'MongoDB'],
        'icon': FontAwesomeIcons.userShield,
        'gradient': AppGradients.buttonGradient,
      },
      {
        'name': 'Payment Gateway API',
        'version': 'v1.8.2',
        'status': 'Active',
        'description':
            'Complete payment processing solution with support for multiple payment methods and currencies.',
        'endpoints': 8,
        'uptime': '99.8%',
        'responseTime': '120ms',
        'technologies': ['Stripe', 'PayPal', 'Express.js', 'Redis'],
        'icon': FontAwesomeIcons.creditCard,
        'gradient':
            const LinearGradient(colors: [AppColors.success, AppColors.accentTeal]),
      },
      {
        'name': 'File Storage API',
        'version': 'v3.0.1',
        'status': 'Active',
        'description':
            'Scalable file upload and management system with CDN integration and image processing capabilities.',
        'endpoints': 15,
        'uptime': '99.7%',
        'responseTime': '200ms',
        'technologies': ['AWS S3', 'CloudFront', 'Sharp', 'Multer'],
        'icon': FontAwesomeIcons.cloud,
        'gradient': const LinearGradient(
            colors: [AppColors.primaryBlue, AppColors.primaryCyan]),
      },
      {
        'name': 'Notification Service API',
        'version': 'v1.5.0',
        'status': 'Development',
        'description':
            'Real-time notification system supporting push notifications, email, and SMS delivery.',
        'endpoints': 6,
        'uptime': '98.9%',
        'responseTime': '80ms',
        'technologies': ['Socket.io', 'FCM', 'Twilio', 'NodeMailer'],
        'icon': FontAwesomeIcons.bell,
        'gradient': const LinearGradient(
            colors: [AppColors.accentOrange, AppColors.accentGold]),
      },
      {
        'name': 'Analytics API',
        'version': 'v2.3.0',
        'status': 'Active',
        'description':
            'Comprehensive analytics platform with real-time tracking, custom events, and detailed reporting.',
        'endpoints': 20,
        'uptime': '99.9%',
        'responseTime': '65ms',
        'technologies': ['PostgreSQL', 'InfluxDB', 'Grafana', 'Docker'],
        'icon': FontAwesomeIcons.chartBar,
        'gradient': const LinearGradient(
            colors: [AppColors.secondaryPurple, AppColors.primaryPurple]),
      },
      {
        'name': 'Chat API',
        'version': 'v1.2.1',
        'status': 'Active',
        'description':
            'Real-time messaging service with group chats, file sharing, and end-to-end encryption.',
        'endpoints': 10,
        'uptime': '99.5%',
        'responseTime': '35ms',
        'technologies': ['WebSocket', 'Socket.io', 'Encryption', 'MongoDB'],
        'icon': FontAwesomeIcons.comments,
        'gradient': AppGradients.accentGradient,
      },
    ];
  }
}
