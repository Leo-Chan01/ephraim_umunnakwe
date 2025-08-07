import 'package:ephraim_umunnakwe/pages/web/routes/app_routes.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/glass_card.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/gradient_container.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/modern_footer.dart';
import 'package:ephraim_umunnakwe/theme/colors.dart';
import 'package:ephraim_umunnakwe/utils/util_methods.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:animated_text_kit/animated_text_kit.dart';

class ModernAboutMe extends StatefulWidget {
  const ModernAboutMe({super.key});

  @override
  State<ModernAboutMe> createState() => _ModernAboutMeState();
}

class _ModernAboutMeState extends State<ModernAboutMe>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _slideController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  final gestureRecogniser = TapGestureRecognizer();

  @override
  void initState() {
    super.initState();

    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _slideController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeOutCubic,
    ));

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.5),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _slideController,
      curve: Curves.easeOutBack,
    ));

    // Start animations
    _fadeController.forward();
    Future.delayed(const Duration(milliseconds: 300), () {
      _slideController.forward();
    });
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _slideController.dispose();
    gestureRecogniser.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isDesktop = screenWidth > 768;

    return Scaffold(
      body: GradientContainer(
        includeStars: true,
        child: Stack(
          children: [
            SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.symmetric(
                  horizontal: isDesktop ? 40 : 20,
                  vertical: 20,
                ),
                child: Column(
                  children: [
                    const SizedBox(height: 100),

                    // Header Section
                    _buildHeaderSection(context, isDesktop),

                    const SizedBox(height: 60),

                    // Main Content
                    isDesktop
                        ? _buildDesktopContent(context)
                        : _buildMobileContent(context),

                    const SizedBox(height: 80),

                    // Journey Timeline
                    _buildJourneySection(context, isDesktop),

                    const SizedBox(height: 60),

                    // Footer
                    ModernFooter(isDesktop: isDesktop),
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

  Widget _buildHeaderSection(BuildContext context, bool isDesktop) {
    return AnimatedBuilder(
      animation: _fadeAnimation,
      builder: (context, child) {
        return Opacity(
          opacity: _fadeAnimation.value,
          child: Column(
            children: [
              // Animated Title
              ShaderMask(
                shaderCallback: (bounds) =>
                    AppGradients.accentGradient.createShader(bounds),
                child: DefaultTextStyle(
                  style: Theme.of(context).textTheme.headlineLarge!.copyWith(
                        fontSize: isDesktop ? 48 : 36,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                  child: AnimatedTextKit(
                    animatedTexts: [
                      WavyAnimatedText('About Me'),
                      WavyAnimatedText('My Story'),
                      WavyAnimatedText('King Raym'),
                    ],
                    isRepeatingAnimation: true,
                    pause: const Duration(seconds: 2),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              Text(
                'Get to know the person behind the code',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.titleMedium!.copyWith(
                      color: AppColors.textSecondary,
                    ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDesktopContent(BuildContext context) {
    return SlideTransition(
      position: _slideAnimation,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Bio Section
          Expanded(
            flex: 2,
            child: _buildBioSection(context, true),
          ),

          const SizedBox(width: 60),

          // Profile & Skills Section
          Expanded(
            child: _buildProfileSection(context, true),
          ),
        ],
      ),
    );
  }

  Widget _buildMobileContent(BuildContext context) {
    return SlideTransition(
      position: _slideAnimation,
      child: Column(
        children: [
          _buildProfileSection(context, false),
          const SizedBox(height: 40),
          _buildBioSection(context, false),
        ],
      ),
    );
  }

  Widget _buildBioSection(BuildContext context, bool isDesktop) {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Personal Introduction
          RichText(
            text: TextSpan(
              style: Theme.of(context).textTheme.bodyLarge!.copyWith(
                    height: 1.8,
                  ),
              children: [
                const TextSpan(text: "Hi, I'm "),
                TextSpan(
                  text: 'Ephraim Umunnakwe',
                  style: TextStyle(
                    color: AppColors.accentGold,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const TextSpan(
                  text:
                      ", but you can call me King Raym, which is a nickname I've embraced with pride. I hail from ",
                ),
                TextSpan(
                  text: 'Imo State, Nigeria.',
                  style: TextStyle(
                    color: AppColors.accentOrange,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const TextSpan(
                    text:
                        "\n\nMy friends often call me Leo, a name that reflects both my strength and leadership qualities. "
                        "I'm passionate about technology and software development, particularly in the realm of mobile applications. "
                        "My expertise lies in Flutter, where I leverage Provider for state management to build efficient, scalable, and high-performing apps."),
              ],
            ),
          ),

          const SizedBox(height: 30),

          // Company Information
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: AppGradients.cardGradient,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: AppColors.accentOrange.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      FontAwesomeIcons.rocket,
                      color: AppColors.accentOrange,
                      size: 20,
                    ),
                    const SizedBox(width: 12),
                    Text(
                      'Founder & CEO',
                      style: Theme.of(context).textTheme.titleMedium!.copyWith(
                            fontWeight: FontWeight.bold,
                            color: AppColors.accentOrange,
                          ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                RichText(
                  text: TextSpan(
                    style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                          height: 1.6,
                        ),
                    children: [
                      const TextSpan(
                        text: 'In 2023, I founded a startup ',
                      ),
                      TextSpan(
                        text: '"Raym Universe Limited"',
                        recognizer: gestureRecogniser
                          ..onTap = () async {
                            await openLink('https://theraymuniverse.com');
                          },
                        style: TextStyle(
                          color: AppColors.accentGold,
                          fontWeight: FontWeight.bold,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                      const TextSpan(
                        text:
                            '. A dynamic and innovative company dedicated to transforming ideas '
                            'into reality through cutting-edge technology and creative solutions.',
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileSection(BuildContext context, bool isDesktop) {
    return Column(
      children: [
        // Profile Image with Enhanced Styling
        GlassCard(
          child: Column(
            children: [
              Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.accentGold.withOpacity(0.3),
                      blurRadius: 20,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: CircleAvatar(
                  radius: isDesktop ? 100 : 80,
                  backgroundColor: AppColors.cardGlass,
                  child: CircleAvatar(
                    radius: isDesktop ? 95 : 75,
                    backgroundImage:
                        const AssetImage('assets/images/profile_img.jpg'),
                  ),
                ),
              ),

              const SizedBox(height: 30),

              // Core Technologies
              Text(
                'Core Technologies',
                style: Theme.of(context).textTheme.titleMedium!.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),

              const SizedBox(height: 20),

              // Tech Stack Icons
              Wrap(
                spacing: 20,
                runSpacing: 15,
                alignment: WrapAlignment.center,
                children: [
                  _buildTechIcon(
                      FontAwesomeIcons.android, Colors.green, 'Android'),
                  _buildTechIcon(FontAwesomeIcons.apple, Colors.grey, 'iOS'),
                  _buildTechIcon(
                      FontAwesomeIcons.nodeJs, Colors.green, 'Node.js'),
                  _buildTechIcon(
                      FontAwesomeIcons.js, Colors.yellow, 'JavaScript'),
                  _buildTechIcon(
                      FontAwesomeIcons.python, Colors.blue, 'Python'),
                  _buildTechIcon(FontAwesomeIcons.java, Colors.red, 'Java'),
                ],
              ),

              const SizedBox(height: 30),

              // Personal Brand
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: AppGradients.cardGradient,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.asset(
                        'assets/images/kingseurekalogo.png',
                        width: 80,
                        height: 80,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      "King's Eureka - Personal Brand",
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "I write on Hashnode, Twitter and Dev.to",
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodySmall!.copyWith(
                            color: AppColors.textMuted,
                          ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildTechIcon(IconData icon, Color color, String label) {
    return Column(
      children: [
        Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [color, color.withOpacity(0.7)],
            ),
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: color.withOpacity(0.3),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Icon(
            icon,
            color: Colors.white,
            size: 24,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: TextStyle(
            fontSize: 10,
            color: AppColors.textMuted,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildJourneySection(BuildContext context, bool isDesktop) {
    return GlassCard(
      child: Column(
        children: [
          Row(
            children: [
              Icon(
                FontAwesomeIcons.route,
                color: AppColors.accentTeal,
                size: 24,
              ),
              const SizedBox(width: 12),
              Text(
                'My Journey So Far',
                style: Theme.of(context).textTheme.headlineMedium!.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          Text(
            'This highlights the most notable parts of my journey and not everything, '
            'so you don\'t get bored with those details...',
            style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                  color: AppColors.textSecondary,
                ),
          ),

          const SizedBox(height: 40),

          // Journey Timeline (simplified for now)
          _buildTimelineItem('2014', 'Started Programming',
              'Began learning C, C++ and programming fundamentals'),
          _buildTimelineItem('2019', 'Android Development',
              'Took the GADS 2019 Scholarship with Andela'),
          _buildTimelineItem('2021', 'Flutter Journey',
              'Advanced Flutter learning and freelance projects'),
          _buildTimelineItem(
              '2023', 'Founded Startup', 'Established Raym Universe Limited'),
          _buildTimelineItem('2024', 'Current Focus',
              'Exploring AI integration with Flutter and robotics'),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(String year, String title, String description) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Year Badge
          Container(
            width: 60,
            padding: const EdgeInsets.symmetric(vertical: 8),
            decoration: BoxDecoration(
              gradient: AppGradients.buttonGradient,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              year,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ),

          const SizedBox(width: 20),

          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleSmall!.copyWith(
                        fontWeight: FontWeight.bold,
                        color: AppColors.accentGold,
                      ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                        color: AppColors.textSecondary,
                        height: 1.5,
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
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
}
