import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/portfolio_data.dart';
import '../services/supabase_service.dart';

class AdminProvider extends ChangeNotifier {
  final SupabaseService _supabaseService = SupabaseService();

  List<Project> _projects = [];
  List<Testimonial> _testimonials = [];
  List<SocialLink> _socialLinks = [];
  PersonalInfo? _personalInfo;

  bool _isLoading = false;
  String? _lastSavedPath;
  String? _errorMessage;

  // Getters
  List<Project> get projects => _projects;
  List<Testimonial> get testimonials => _testimonials;
  List<SocialLink> get socialLinks => _socialLinks;
  PersonalInfo? get personalInfo => _personalInfo;
  bool get isLoading => _isLoading;
  String? get lastSavedPath => _lastSavedPath;
  String? get errorMessage => _errorMessage;

  AdminProvider() {
    _loadDataFromSupabase();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _errorMessage = error;
    notifyListeners();
  }

  // Load data from Supabase
  Future<void> _loadDataFromSupabase() async {
    _setLoading(true);
    _setError(null);

    try {
      // Load all data in parallel
      final results = await Future.wait([
        _supabaseService.getProjects(),
        _supabaseService.getTestimonials(),
        _supabaseService.getSocialLinks(),
        _supabaseService.getPersonalInfo(),
      ]);

      _projects = results[0] as List<Project>;
      _testimonials = results[1] as List<Testimonial>;
      _socialLinks = results[2] as List<SocialLink>;
      _personalInfo = results[3] as PersonalInfo?;

      // If no data exists, initialize with sample data
      if (_projects.isEmpty &&
          _testimonials.isEmpty &&
          _socialLinks.isEmpty &&
          _personalInfo == null) {
        await _initializeWithSampleData();
      }
    } catch (e) {
      _setError('Failed to load data: $e');
      print('Error loading data from Supabase: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Initialize with sample data and save to Supabase
  Future<void> _initializeWithSampleData() async {
    final personalInfo = PersonalInfo(
      name: 'Ephraim Umunnakwe',
      title: 'Full Stack Developer',
      email: 'ephraim@example.com',
      phone: '+234 (0) 123 456 7890',
      location: 'Lagos, Nigeria',
      bio:
          'Passionate developer specializing in Flutter, React, and modern web technologies.',
    );

    final socialLinks = [
      SocialLink(platform: 'github', url: 'https://github.com/your-handle'),
      SocialLink(
          platform: 'linkedin', url: 'https://linkedin.com/in/your-handle'),
      SocialLink(platform: 'twitter', url: 'https://twitter.com/your-handle'),
      SocialLink(platform: 'email', url: 'mailto:ephraim@example.com'),
    ];

    final projects = [
      Project(
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

    final testimonials = [
      Testimonial(
        author: 'Chinedu Okafor',
        role: 'Product Manager, Ahiaoma',
        message:
            'Ephraim is a rare talent. He delivered complex features ahead of schedule and brought clarity to our product direction.',
        rating: 5.0,
        createdAt: DateTime(2025, 6, 1),
      ),
      Testimonial(
        author: 'Sarah Johnson',
        role: 'CTO, BrillXChange',
        message:
            'His attention to detail and commitment to performance optimization significantly improved our app stability.',
        rating: 4.5,
        createdAt: DateTime(2025, 7, 10),
      ),
    ];

    // Save to Supabase
    try {
      await _supabaseService.upsertPersonalInfo(personalInfo);
      for (final link in socialLinks) {
        await _supabaseService.upsertSocialLink(link);
      }
      for (final project in projects) {
        await _supabaseService.addProject(project);
      }
      for (final testimonial in testimonials) {
        await _supabaseService.addTestimonial(testimonial);
      }

      // Update local state
      _personalInfo = personalInfo;
      _socialLinks = socialLinks;
      _projects = projects;
      _testimonials = testimonials;
    } catch (e) {
      print('Error initializing sample data: $e');
    }
  }

  // Refresh data from Supabase
  Future<void> refreshData() async {
    await _loadDataFromSupabase();
  }

  // Projects CRUD
  Future<void> addProject(Project project) async {
    _setLoading(true);
    _setError(null);

    try {
      final newProject = await _supabaseService.addProject(project);
      if (newProject != null) {
        _projects.add(newProject);
        notifyListeners();
      }
    } catch (e) {
      _setError('Failed to add project: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> updateProject(Project project) async {
    _setLoading(true);
    _setError(null);

    try {
      final updatedProject = await _supabaseService.updateProject(project);
      if (updatedProject != null) {
        final index = _projects.indexWhere((p) => p.id == project.id);
        if (index != -1) {
          _projects[index] = updatedProject;
          notifyListeners();
        }
      }
    } catch (e) {
      _setError('Failed to update project: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> deleteProject(int id) async {
    _setLoading(true);
    _setError(null);

    try {
      final success = await _supabaseService.deleteProject(id);
      if (success) {
        _projects.removeWhere((p) => p.id == id);
        notifyListeners();
      }
    } catch (e) {
      _setError('Failed to delete project: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Testimonials CRUD
  Future<void> addTestimonial(Testimonial testimonial) async {
    _setLoading(true);
    _setError(null);

    try {
      final newTestimonial = await _supabaseService.addTestimonial(testimonial);
      if (newTestimonial != null) {
        _testimonials.add(newTestimonial);
        notifyListeners();
      }
    } catch (e) {
      _setError('Failed to add testimonial: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> updateTestimonial(Testimonial testimonial) async {
    _setLoading(true);
    _setError(null);

    try {
      final updatedTestimonial =
          await _supabaseService.updateTestimonial(testimonial);
      if (updatedTestimonial != null) {
        final index = _testimonials.indexWhere((t) => t.id == testimonial.id);
        if (index != -1) {
          _testimonials[index] = updatedTestimonial;
          notifyListeners();
        }
      }
    } catch (e) {
      _setError('Failed to update testimonial: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> deleteTestimonial(int id) async {
    _setLoading(true);
    _setError(null);

    try {
      final success = await _supabaseService.deleteTestimonial(id);
      if (success) {
        _testimonials.removeWhere((t) => t.id == id);
        notifyListeners();
      }
    } catch (e) {
      _setError('Failed to delete testimonial: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Social Links CRUD
  Future<void> updateSocialLink(String platform, String url) async {
    _setLoading(true);
    _setError(null);

    try {
      final socialLink = SocialLink(platform: platform, url: url);
      final updatedLink = await _supabaseService.upsertSocialLink(socialLink);
      if (updatedLink != null) {
        final index = _socialLinks.indexWhere((s) => s.platform == platform);
        if (index != -1) {
          _socialLinks[index] = updatedLink;
        } else {
          _socialLinks.add(updatedLink);
        }
        notifyListeners();
      }
    } catch (e) {
      _setError('Failed to update social link: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<void> toggleSocialLinkVisibility(String platform) async {
    final index = _socialLinks.indexWhere((s) => s.platform == platform);
    if (index != -1) {
      final link = _socialLinks[index];
      final updatedLink = link.copyWith(isVisible: !link.isVisible);
      await updateSocialLink(platform, updatedLink.url);
    }
  }

  Future<void> deleteSocialLink(String platform) async {
    _setLoading(true);
    _setError(null);

    try {
      final success = await _supabaseService.deleteSocialLink(platform);
      if (success) {
        _socialLinks.removeWhere((s) => s.platform == platform);
        notifyListeners();
      }
    } catch (e) {
      _setError('Failed to delete social link: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Personal Info
  Future<void> updatePersonalInfo(PersonalInfo info) async {
    _setLoading(true);
    _setError(null);

    try {
      final updatedInfo = await _supabaseService.upsertPersonalInfo(info);
      if (updatedInfo != null) {
        _personalInfo = updatedInfo;
        notifyListeners();
      }
    } catch (e) {
      _setError('Failed to update personal info: $e');
    } finally {
      _setLoading(false);
    }
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
