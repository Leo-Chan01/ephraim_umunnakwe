import 'package:ephraim_umunnakwe/pages/web/widgets/glass_card.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/gradient_container.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/modern_footer.dart';
import 'package:ephraim_umunnakwe/pages/web/routes/app_routes.dart';
import 'package:ephraim_umunnakwe/theme/colors.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:animated_text_kit/animated_text_kit.dart';

class ModernHireMeScreen extends StatefulWidget {
  const ModernHireMeScreen({super.key});

  @override
  State<ModernHireMeScreen> createState() => _ModernHireMeScreenState();
}

class _ModernHireMeScreenState extends State<ModernHireMeScreen>
    with TickerProviderStateMixin {
  late AnimationController _headerController;
  late AnimationController _formController;
  late AnimationController _servicesController;
  late Animation<double> _headerAnimation;
  late Animation<double> _formAnimation;
  late Animation<double> _servicesAnimation;

  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _subjectController = TextEditingController();
  final _messageController = TextEditingController();

  @override
  void initState() {
    super.initState();

    _headerController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _formController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _servicesController = AnimationController(
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

    _formAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _formController,
      curve: Curves.easeOutBack,
    ));

    _servicesAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _servicesController,
      curve: Curves.elasticOut,
    ));

    // Start animations
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _headerController.forward();
      Future.delayed(const Duration(milliseconds: 300), () {
        _formController.forward();
      });
      Future.delayed(const Duration(milliseconds: 600), () {
        _servicesController.forward();
      });
    });
  }

  @override
  void dispose() {
    _headerController.dispose();
    _formController.dispose();
    _servicesController.dispose();
    _nameController.dispose();
    _emailController.dispose();
    _subjectController.dispose();
    _messageController.dispose();
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
                    if (isDesktop)
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(flex: 3, child: _buildContactForm(context)),
                          const SizedBox(width: 40),
                          Expanded(
                              flex: 2, child: _buildServicesSection(context)),
                        ],
                      )
                    else
                      Column(
                        children: [
                          _buildContactForm(context),
                          const SizedBox(height: 40),
                          _buildServicesSection(context),
                        ],
                      ),

                    const SizedBox(height: 80),

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
                          fontSize: isDesktop ? 48 : 36,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                    child: AnimatedTextKit(
                      animatedTexts: [
                        WavyAnimatedText('Let\'s Work Together'),
                        WavyAnimatedText('Hire Me'),
                        WavyAnimatedText('Start Your Project'),
                      ],
                      isRepeatingAnimation: true,
                      pause: const Duration(seconds: 2),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                Container(
                  constraints: BoxConstraints(
                    maxWidth: isDesktop ? 600 : double.infinity,
                  ),
                  child: Text(
                    'Ready to bring your ideas to life? Let\'s discuss your project and create something amazing together. '
                    'I specialize in mobile apps, web platforms, and innovative solutions.',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.titleMedium!.copyWith(
                          color: AppColors.textSecondary,
                          height: 1.6,
                        ),
                  ),
                ),

                const SizedBox(height: 30),

                // Quick Stats
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _buildStatChip('24h', 'Response Time',
                        FontAwesomeIcons.clock, AppColors.primaryBlue),
                    const SizedBox(width: 20),
                    _buildStatChip('100%', 'Success Rate',
                        FontAwesomeIcons.checkCircle, AppColors.success),
                    const SizedBox(width: 20),
                    _buildStatChip('50+', 'Happy Clients',
                        FontAwesomeIcons.users, AppColors.accentOrange),
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
                  fontSize: 16,
                ),
              ),
              Text(
                label,
                style: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 10,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildContactForm(BuildContext context) {
    return AnimatedBuilder(
      animation: _formAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _formAnimation.value,
          child: Opacity(
            opacity: _formAnimation.value,
            child: GlassCard(
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Get In Touch',
                      style:
                          Theme.of(context).textTheme.headlineSmall!.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                    ),

                    const SizedBox(height: 8),

                    Text(
                      'Fill out the form below and I\'ll get back to you within 24 hours.',
                      style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                            color: AppColors.textSecondary,
                          ),
                    ),

                    const SizedBox(height: 30),

                    // Name Field
                    _buildFormField(
                      controller: _nameController,
                      label: 'Full Name',
                      icon: FontAwesomeIcons.user,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your name';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 20),

                    // Email Field
                    _buildFormField(
                      controller: _emailController,
                      label: 'Email Address',
                      icon: FontAwesomeIcons.envelope,
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your email';
                        }
                        if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                            .hasMatch(value)) {
                          return 'Please enter a valid email';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 20),

                    // Subject Field
                    _buildFormField(
                      controller: _subjectController,
                      label: 'Subject',
                      icon: FontAwesomeIcons.tag,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter a subject';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 20),

                    // Message Field
                    _buildFormField(
                      controller: _messageController,
                      label: 'Message',
                      icon: FontAwesomeIcons.message,
                      maxLines: 5,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your message';
                        }
                        if (value.length < 10) {
                          return 'Message must be at least 10 characters';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 30),

                    // Submit Button
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: GlassButton(
                        text: 'Send Message',
                        icon: FontAwesomeIcons.paperPlane,
                        onPressed: _submitForm,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildFormField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          maxLines: maxLines,
          validator: validator,
          style: Theme.of(context).textTheme.bodyMedium,
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: AppColors.primaryBlue, size: 20),
            hintText: 'Enter your $label',
            hintStyle: TextStyle(color: AppColors.textMuted),
            filled: true,
            fillColor: AppColors.cardGlass,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: AppColors.borderColor),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: AppColors.borderColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: AppColors.primaryBlue, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: AppColors.error),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildServicesSection(BuildContext context) {
    return AnimatedBuilder(
      animation: _servicesAnimation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(100 * (1 - _servicesAnimation.value), 0),
          child: Opacity(
            opacity: _servicesAnimation.value,
            child: Column(
              children: [
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'My Services',
                        style:
                            Theme.of(context).textTheme.headlineSmall!.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                      ),

                      const SizedBox(height: 20),

                      // Services List
                      _buildServiceItem(
                        'Mobile App Development',
                        'Flutter • React Native • iOS • Android',
                        FontAwesomeIcons.mobile,
                        AppColors.primaryBlue,
                      ),

                      const SizedBox(height: 16),

                      _buildServiceItem(
                        'Web Development',
                        'React • Vue • Angular • Flutter Web',
                        FontAwesomeIcons.globe,
                        AppColors.accentOrange,
                      ),

                      const SizedBox(height: 16),

                      _buildServiceItem(
                        'Backend Development',
                        'Node.js • Python • Firebase • Supabase',
                        FontAwesomeIcons.server,
                        AppColors.success,
                      ),

                      const SizedBox(height: 16),

                      _buildServiceItem(
                        'UI/UX Design',
                        'Figma • Adobe XD • Prototyping',
                        FontAwesomeIcons.paintbrush,
                        AppColors.secondaryPurple,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Contact Info Card
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Direct Contact',
                        style: Theme.of(context).textTheme.titleLarge!.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                      ),

                      const SizedBox(height: 20),

                      _buildContactItem(
                        'ephraim@umunnakwe.com',
                        FontAwesomeIcons.envelope,
                        AppColors.primaryBlue,
                      ),

                      const SizedBox(height: 12),

                      _buildContactItem(
                        '+234 (0) 123 456 7890',
                        FontAwesomeIcons.phone,
                        AppColors.success,
                      ),

                      const SizedBox(height: 12),

                      _buildContactItem(
                        'Lagos, Nigeria',
                        FontAwesomeIcons.mapMarkerAlt,
                        AppColors.accentOrange,
                      ),

                      const SizedBox(height: 20),

                      // Social Links
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildSocialButton(
                              FontAwesomeIcons.linkedin, AppColors.primaryBlue),
                          _buildSocialButton(
                              FontAwesomeIcons.github, AppColors.textSecondary),
                          _buildSocialButton(
                              FontAwesomeIcons.twitter, AppColors.primaryBlue),
                          _buildSocialButton(FontAwesomeIcons.instagram,
                              AppColors.accentOrange),
                        ],
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

  Widget _buildServiceItem(
      String title, String description, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [color.withOpacity(0.1), color.withOpacity(0.05)],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.bodyLarge!.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: Theme.of(context).textTheme.bodySmall!.copyWith(
                        color: AppColors.textSecondary,
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactItem(String text, IconData icon, Color color) {
    return Row(
      children: [
        Icon(icon, color: color, size: 18),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ),
      ],
    );
  }

  Widget _buildSocialButton(IconData icon, Color color) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Icon(icon, color: color, size: 18),
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

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text(
              'Message sent successfully! I\'ll get back to you soon.'),
          backgroundColor: AppColors.success,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      );

      // Clear form
      _nameController.clear();
      _emailController.clear();
      _subjectController.clear();
      _messageController.clear();
    }
  }
}
