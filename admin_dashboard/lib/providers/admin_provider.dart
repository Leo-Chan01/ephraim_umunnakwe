import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/portfolio_data.dart';

class AdminProvider extends ChangeNotifier {
  List<Project> _projects = [];
  List<Testimonial> _testimonials = [];
  List<SocialLink> _socialLinks = [];
  PersonalInfo? _personalInfo;

  bool _isLoading = false;
  String? _lastSavedPath;

  // Getters
  List<Project> get projects => _projects;
  List<Testimonial> get testimonials => _testimonials;
  List<SocialLink> get socialLinks => _socialLinks;
  PersonalInfo? get personalInfo => _personalInfo;
  bool get isLoading => _isLoading;
  String? get lastSavedPath => _lastSavedPath;

  AdminProvider() {
    _loadInitialData();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  // Initialize with sample data
  void _loadInitialData() {
    _personalInfo = PersonalInfo(
      name: 'Ephraim Umunnakwe',
      title: 'Full Stack Developer',
      email: 'ephraim@example.com',
      phone: '+234 (0) 123 456 7890',
      location: 'Lagos, Nigeria',
      bio:
          'Passionate developer specializing in Flutter, React, and modern web technologies.',
    );

    _socialLinks = [
      SocialLink(platform: 'github', url: 'https://github.com/your-handle'),
      SocialLink(
          platform: 'linkedin', url: 'https://linkedin.com/in/your-handle'),
      SocialLink(platform: 'twitter', url: 'https://twitter.com/your-handle'),
      SocialLink(platform: 'email', url: 'mailto:ephraim@example.com'),
    ];

    _projects = [
      Project(
        id: 1,
        name: 'Ahiaoma App and Reseller',
        description:
            'Developed an online retail platform with shopping cart and payment integration.',
        status: 'In Progress',
        startDate: DateTime(2024, 1, 1),
        endDate: DateTime(2025, 8, 30),
        priority: 'High',
        technologies: ['Flutter', 'TypeScript', 'Supabase'],
        role: 'Full Stack Developer',
      ),
      Project(
        id: 2,
        name: 'BrillXChange App',
        description:
            'Created a cross-platform mobile application for iOS and Android.',
        status: 'In Progress',
        startDate: DateTime(2024, 3, 1),
        endDate: DateTime(2025, 10, 30),
        priority: 'Medium',
        technologies: ['Flutter', 'Rest API'],
        role: 'Mobile Developer',
      ),
    ];

    _testimonials = [
      Testimonial(
        id: 1,
        author: 'Chinedu Okafor',
        role: 'Product Manager, Ahiaoma',
        message:
            'Ephraim is a rare talent. He delivered complex features ahead of schedule and brought clarity to our product direction.',
        rating: 5.0,
        createdAt: DateTime(2025, 6, 1),
      ),
      Testimonial(
        id: 2,
        author: 'Sarah Johnson',
        role: 'CTO, BrillXChange',
        message:
            'His attention to detail and commitment to performance optimization significantly improved our app stability.',
        rating: 4.5,
        createdAt: DateTime(2025, 7, 10),
      ),
    ];

    notifyListeners();
  }

  // Projects CRUD
  void addProject(Project project) {
    final newId = _projects.isNotEmpty
        ? _projects.map((p) => p.id ?? 0).reduce((a, b) => a > b ? a : b) + 1
        : 1;
    final newProject = project.copyWith(id: newId);
    _projects.add(newProject);
    notifyListeners();
  }

  void updateProject(Project project) {
    final index = _projects.indexWhere((p) => p.id == project.id);
    if (index != -1) {
      _projects[index] = project;
      notifyListeners();
    }
  }

  void deleteProject(int id) {
    _projects.removeWhere((p) => p.id == id);
    notifyListeners();
  }

  // Testimonials CRUD
  void addTestimonial(Testimonial testimonial) {
    final newId = _testimonials.isNotEmpty
        ? _testimonials.map((t) => t.id ?? 0).reduce((a, b) => a > b ? a : b) +
            1
        : 1;
    final newTestimonial = testimonial.copyWith(id: newId);
    _testimonials.add(newTestimonial);
    notifyListeners();
  }

  void updateTestimonial(Testimonial testimonial) {
    final index = _testimonials.indexWhere((t) => t.id == testimonial.id);
    if (index != -1) {
      _testimonials[index] = testimonial;
      notifyListeners();
    }
  }

  void deleteTestimonial(int id) {
    _testimonials.removeWhere((t) => t.id == id);
    notifyListeners();
  }

  // Social Links CRUD
  void updateSocialLink(String platform, String url) {
    final index = _socialLinks.indexWhere((s) => s.platform == platform);
    if (index != -1) {
      _socialLinks[index] = _socialLinks[index].copyWith(url: url);
    } else {
      _socialLinks.add(SocialLink(platform: platform, url: url));
    }
    notifyListeners();
  }

  void toggleSocialLinkVisibility(String platform) {
    final index = _socialLinks.indexWhere((s) => s.platform == platform);
    if (index != -1) {
      _socialLinks[index] = _socialLinks[index]
          .copyWith(isVisible: !_socialLinks[index].isVisible);
      notifyListeners();
    }
  }

  void deleteSocialLink(String platform) {
    _socialLinks.removeWhere((s) => s.platform == platform);
    notifyListeners();
  }

  // Personal Info
  void updatePersonalInfo(PersonalInfo info) {
    _personalInfo = info;
    notifyListeners();
  }

  // Export data to JSON files
  Future<void> exportData() async {
    _setLoading(true);
    try {
      final directory = await getApplicationDocumentsDirectory();
      final exportDir = Directory('${directory.path}/portfolio_export');
      if (!await exportDir.exists()) {
        await exportDir.create(recursive: true);
      }

      // Export projects
      final projectsFile = File('${exportDir.path}/projects.json');
      final projectsData = {
        'projects': _projects.map((p) => p.toJson()).toList(),
      };
      await projectsFile.writeAsString(jsonEncode(projectsData));

      // Export testimonials
      final testimonialsFile = File('${exportDir.path}/testimonials.json');
      final testimonialsData = {
        'testimonials': _testimonials.map((t) => t.toJson()).toList(),
      };
      await testimonialsFile.writeAsString(jsonEncode(testimonialsData));

      // Export social links
      final linksFile = File('${exportDir.path}/social_links.json');
      final linksData = {
        'social_links': _socialLinks.map((s) => s.toJson()).toList(),
      };
      await linksFile.writeAsString(jsonEncode(linksData));

      // Export personal info
      if (_personalInfo != null) {
        final personalFile = File('${exportDir.path}/personal_info.json');
        await personalFile.writeAsString(jsonEncode(_personalInfo!.toJson()));
      }

      _lastSavedPath = exportDir.path;

      // Save export path to preferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('last_export_path', exportDir.path);
    } catch (e) {
      print('Export error: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Get portfolio statistics
  Map<String, dynamic> getStatistics() {
    final completedProjects =
        _projects.where((p) => p.status.toLowerCase() == 'completed').length;
    final inProgressProjects =
        _projects.where((p) => p.status.toLowerCase() == 'in progress').length;
    final averageRating = _testimonials.isNotEmpty
        ? _testimonials.map((t) => t.rating).reduce((a, b) => a + b) /
            _testimonials.length
        : 0.0;

    return {
      'total_projects': _projects.length,
      'completed_projects': completedProjects,
      'in_progress_projects': inProgressProjects,
      'total_testimonials': _testimonials.length,
      'average_rating': averageRating,
      'total_technologies':
          _projects.expand((p) => p.technologies).toSet().length,
    };
  }
}
