import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/admin_provider.dart';
import '../theme/admin_theme.dart';
import '../widgets/dashboard_card.dart';
import '../widgets/stat_card.dart';
import 'projects_screen.dart';
import 'testimonials_screen.dart';
import 'social_links_screen.dart';
import 'personal_info_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isDarkMode = false;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Portfolio Admin Dashboard',
      theme: AdminTheme.lightTheme,
      darkTheme: AdminTheme.darkTheme,
      themeMode: _isDarkMode ? ThemeMode.dark : ThemeMode.light,
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Portfolio Admin Dashboard'),
          actions: [
            IconButton(
              icon: Icon(_isDarkMode ? Icons.light_mode : Icons.dark_mode),
              onPressed: () {
                setState(() {
                  _isDarkMode = !_isDarkMode;
                });
              },
              tooltip:
                  _isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
            ),
            const SizedBox(width: 8),
            Consumer<AdminProvider>(
              builder: (context, provider, child) {
                return IconButton(
                  icon: provider.isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Icon(Icons.save),
                  onPressed:
                      provider.isLoading ? null : () => _exportData(context),
                  tooltip: 'Export Data',
                );
              },
            ),
            const SizedBox(width: 16),
          ],
        ),
        body: Consumer<AdminProvider>(
          builder: (context, provider, child) {
            final stats = provider.getStatistics();

            return SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Welcome section
                  Text(
                    'Welcome back, ${provider.personalInfo?.name ?? 'Admin'}!',
                    style: Theme.of(context).textTheme.displayMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Manage your portfolio content from this dashboard.',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: Theme.of(context).textTheme.bodySmall?.color,
                        ),
                  ),
                  const SizedBox(height: 32),

                  // Statistics cards
                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: _getGridColumns(context),
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 2.5,
                    children: [
                      StatCard(
                        title: 'Total Projects',
                        value: stats['total_projects'].toString(),
                        icon: Icons.work_outline,
                        color: AdminTheme.primaryColor,
                      ),
                      StatCard(
                        title: 'Completed',
                        value: stats['completed_projects'].toString(),
                        icon: Icons.check_circle_outline,
                        color: AdminTheme.successColor,
                      ),
                      StatCard(
                        title: 'In Progress',
                        value: stats['in_progress_projects'].toString(),
                        icon: Icons.pending_outlined,
                        color: AdminTheme.warningColor,
                      ),
                      StatCard(
                        title: 'Testimonials',
                        value: stats['total_testimonials'].toString(),
                        icon: Icons.star_outline,
                        color: AdminTheme.accentColor,
                      ),
                      StatCard(
                        title: 'Avg Rating',
                        value: stats['average_rating'].toStringAsFixed(1),
                        icon: Icons.sentiment_satisfied_alt,
                        color: AdminTheme.primaryLightColor,
                      ),
                      StatCard(
                        title: 'Technologies',
                        value: stats['total_technologies'].toString(),
                        icon: Icons.code_outlined,
                        color: AdminTheme.primaryDarkColor,
                      ),
                    ],
                  ),

                  const SizedBox(height: 32),

                  // Quick actions
                  Text(
                    'Quick Actions',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 16),

                  GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: _getActionGridColumns(context),
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 1.2,
                    children: [
                      DashboardCard(
                        title: 'Manage Projects',
                        subtitle: '${provider.projects.length} projects',
                        icon: Icons.work_outline,
                        color: AdminTheme.primaryColor,
                        onTap: () =>
                            _navigateToScreen(context, const ProjectsScreen()),
                      ),
                      DashboardCard(
                        title: 'Testimonials',
                        subtitle:
                            '${provider.testimonials.length} testimonials',
                        icon: Icons.star_outline,
                        color: AdminTheme.accentColor,
                        onTap: () => _navigateToScreen(
                            context, const TestimonialsScreen()),
                      ),
                      DashboardCard(
                        title: 'Social Links',
                        subtitle: '${provider.socialLinks.length} links',
                        icon: Icons.link,
                        color: AdminTheme.successColor,
                        onTap: () => _navigateToScreen(
                            context, const SocialLinksScreen()),
                      ),
                      DashboardCard(
                        title: 'Personal Info',
                        subtitle: 'Update your details',
                        icon: Icons.person_outline,
                        color: AdminTheme.warningColor,
                        onTap: () => _navigateToScreen(
                            context, const PersonalInfoScreen()),
                      ),
                    ],
                  ),

                  const SizedBox(height: 32),

                  // Recent activity section
                  Text(
                    'Recent Activity',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 16),

                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (provider.projects.isNotEmpty) ...[
                            _buildActivityItem(
                              context,
                              'Latest Project',
                              provider.projects.first.name,
                              provider.projects.first.startDate ??
                                  DateTime.now(),
                              Icons.work_outline,
                            ),
                            if (provider.testimonials.isNotEmpty)
                              const Divider(),
                          ],
                          if (provider.testimonials.isNotEmpty)
                            _buildActivityItem(
                              context,
                              'Latest Testimonial',
                              'From ${provider.testimonials.last.author}',
                              provider.testimonials.last.createdAt,
                              Icons.star_outline,
                            ),
                          if (provider.projects.isEmpty &&
                              provider.testimonials.isEmpty)
                            const Center(
                              child: Padding(
                                padding: EdgeInsets.all(32),
                                child: Text('No recent activity'),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildActivityItem(
    BuildContext context,
    String title,
    String subtitle,
    DateTime date,
    IconData icon,
  ) {
    return ListTile(
      leading: Icon(icon, color: AdminTheme.primaryColor),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: Text(
        '${date.day}/${date.month}/${date.year}',
        style: Theme.of(context).textTheme.bodySmall,
      ),
    );
  }

  int _getGridColumns(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width > 1200) return 6;
    if (width > 900) return 4;
    if (width > 600) return 3;
    return 2;
  }

  int _getActionGridColumns(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width > 1200) return 4;
    if (width > 600) return 2;
    return 1;
  }

  void _navigateToScreen(BuildContext context, Widget screen) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => screen),
    );
  }

  Future<void> _exportData(BuildContext context) async {
    final provider = Provider.of<AdminProvider>(context, listen: false);
    await provider.exportData();

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content:
              Text('Data exported successfully to ${provider.lastSavedPath}'),
          backgroundColor: AdminTheme.successColor,
        ),
      );
    }
  }
}
