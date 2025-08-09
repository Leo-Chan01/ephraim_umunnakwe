import 'package:ephraim_umunnakwe/pages/web/widgets/glass_card.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/gradient_container.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/modern_footer.dart';
import 'package:ephraim_umunnakwe/pages/web/routes/app_routes.dart';
import 'package:ephraim_umunnakwe/theme/colors.dart';
import 'package:ephraim_umunnakwe/view_models/providers/projects_provider.dart';
import 'package:ephraim_umunnakwe/models/project_model.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:animated_text_kit/animated_text_kit.dart';

class ModernAppProjects extends StatefulWidget {
  const ModernAppProjects({super.key});

  @override
  State<ModernAppProjects> createState() => _ModernAppProjectsState();
}

class _ModernAppProjectsState extends State<ModernAppProjects>
    with TickerProviderStateMixin {
  late AnimationController _headerController;
  late AnimationController _projectsController;
  late Animation<double> _headerAnimation;
  late Animation<double> _projectsAnimation;

  @override
  void initState() {
    super.initState();

    _headerController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _projectsController = AnimationController(
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

    _projectsAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _projectsController,
      curve: Curves.easeOutCubic, // Changed from easeOutBack to easeOutCubic
    ));

    // Load projects and start animations
    WidgetsBinding.instance.addPostFrameCallback((_) {
      getAllProjectList();
      _headerController.forward();
      Future.delayed(const Duration(milliseconds: 500), () {
        _projectsController.forward();
      });
    });
  }

  @override
  void dispose() {
    _headerController.dispose();
    _projectsController.dispose();
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

                    // Projects Grid
                    _buildProjectsSection(context, isDesktop),

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
          opacity: _headerAnimation.value
              .clamp(0.0, 1.0), // Clamp opacity to valid range
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
                        WavyAnimatedText('My Projects'),
                        WavyAnimatedText('Portfolio'),
                        WavyAnimatedText('My Work'),
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
                    'Explore my expanding gallery of work, from mobile applications to web platforms. '
                    'Each project represents a unique challenge solved with creativity and technical expertise.',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.titleMedium!.copyWith(
                          color: AppColors.textSecondary,
                          height: 1.6,
                        ),
                  ),
                ),

                const SizedBox(height: 30),

                // Project Stats
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _buildStatChip('12+', 'Projects', FontAwesomeIcons.code,
                        AppColors.primaryBlue),
                    const SizedBox(width: 20),
                    _buildStatChip('3+', 'In Progress',
                        FontAwesomeIcons.spinner, AppColors.accentOrange),
                    const SizedBox(width: 20),
                    _buildStatChip('8+', 'Completed',
                        FontAwesomeIcons.checkCircle, AppColors.success),
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
                style: TextStyle(
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

  Widget _buildProjectsSection(BuildContext context, bool isDesktop) {
    return AnimatedBuilder(
      animation: _projectsAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _projectsAnimation.value
              .clamp(0.0, 1.0), // Clamp scale to valid range
          child: Opacity(
            opacity: _projectsAnimation.value
                .clamp(0.0, 1.0), // Clamp opacity to valid range
            child: Consumer<PortfolioDataProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading) {
                  return _buildLoadingState(context);
                }

                if (provider.projects.isEmpty) {
                  return _buildEmptyState(context);
                }

                return _buildProjectsGrid(context, provider, isDesktop);
              },
            ),
          ),
        );
      },
    );
  }

  Widget _buildLoadingState(BuildContext context) {
    return GlassCard(
      height: 300,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              gradient: AppGradients.buttonGradient,
              shape: BoxShape.circle,
            ),
            child: const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              strokeWidth: 3,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            'Loading amazing projects...',
            style: Theme.of(context).textTheme.titleMedium,
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return GlassCard(
      height: 300,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            FontAwesomeIcons.folderOpen,
            size: 60,
            color: AppColors.textMuted,
          ),
          const SizedBox(height: 20),
          Text(
            'No projects found',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          Text(
            'Check back soon for exciting updates!',
            style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                  color: AppColors.textMuted,
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectsGrid(
      BuildContext context, PortfolioDataProvider provider, bool isDesktop) {
    return LayoutBuilder(
      builder: (context, constraints) {
        int crossAxisCount = 1;
        if (isDesktop) {
          crossAxisCount = constraints.maxWidth > 1200 ? 3 : 2;
        }

        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            crossAxisSpacing: 20,
            mainAxisSpacing: 20,
            childAspectRatio: isDesktop ? 0.8 : 0.7,
          ),
          itemCount: provider.projects.length,
          itemBuilder: (context, index) {
            final project = provider.projects[index];
            return _buildProjectCard(context, project, index);
          },
        );
      },
    );
  }

  Widget _buildProjectCard(BuildContext context, Project project, int index) {
    final statusColor = _getStatusColor(project.status);

    return GlassCard(
      hasGlow: true,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Project Image
            Container(
              height: 160,
              decoration: BoxDecoration(
                gradient: AppGradients.cardGradient,
                borderRadius: BorderRadius.circular(12),
                image: const DecorationImage(
                  image: AssetImage('assets/images/profile_img.jpg'),
                  fit: BoxFit.cover,
                ),
              ),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.7),
                    ],
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Status Badge
                      Align(
                        alignment: Alignment.topRight,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: statusColor,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            project.status ?? 'Unknown',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),

                      // Project Actions
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          _buildActionButton(
                              FontAwesomeIcons.googlePlay, AppColors.success),
                          const SizedBox(width: 8),
                          _buildActionButton(
                              FontAwesomeIcons.appStore, AppColors.textMuted),
                          const SizedBox(width: 8),
                          _buildActionButton(
                              FontAwesomeIcons.globe, AppColors.primaryBlue),
                          const SizedBox(width: 8),
                          _buildActionButton(
                              FontAwesomeIcons.github, AppColors.textSecondary),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Project Title
            Text(
              project.name ?? 'Untitled Project',
              style: Theme.of(context).textTheme.titleMedium!.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),

            const SizedBox(height: 8),

            // Project Description
            Text(
              project.description ?? 'No description available',
              style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                    color: AppColors.textSecondary,
                    height: 1.4,
                  ),
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),

            const SizedBox(height: 16),

            // Technologies
            if (project.technologies != null &&
                project.technologies!.isNotEmpty)
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: project.technologies!.take(3).map<Widget>((tech) {
                  return Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
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

            // Project Duration
            if (project.startDate != null && project.endDate != null)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.cardGlass,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(
                      FontAwesomeIcons.clock,
                      size: 14,
                      color: AppColors.textMuted,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Duration: ${calculateDurationInMonths(project.startDate, project.endDate)} months',
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
    );
  }

  Widget _buildActionButton(IconData icon, Color color) {
    return Container(
      width: 32,
      height: 32,
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Icon(
        icon,
        size: 16,
        color: color,
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

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'completed':
        return AppColors.success;
      case 'in progress':
        return AppColors.accentOrange;
      case 'planning':
        return AppColors.primaryBlue;
      default:
        return AppColors.textMuted;
    }
  }

  int calculateDurationInMonths(DateTime? startDate, DateTime? endDate) {
    if (startDate == null || endDate == null) {
      return 0;
    }

    int yearsDifference = endDate.year - startDate.year;
    int monthsDifference = endDate.month - startDate.month;

    return yearsDifference * 12 + monthsDifference;
  }

  Future<void> getAllProjectList() async {
    await Provider.of<PortfolioDataProvider>(context, listen: false)
        .fetchProjectsRemote();
  }
}
