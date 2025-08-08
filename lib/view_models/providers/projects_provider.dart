import 'dart:convert';
import 'dart:developer';
import 'package:ephraim_umunnakwe/models/project_model.dart';
import 'package:ephraim_umunnakwe/models/testimonial_model.dart';
import 'package:ephraim_umunnakwe/view_models/api_service/projects_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class PortfolioDataProvider extends ChangeNotifier {
  final SupabaseProjectsService _projectsService;

  PortfolioDataProvider(this._projectsService);

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  // Projects
  List<Project> _projects = [];
  List<Project> get projects => _projects;

  // Testimonials
  List<Testimonial> _testimonials = [];
  List<Testimonial> get testimonials => _testimonials;

  // Links (social / external)
  Map<String, String> _links = {};
  Map<String, String> get links => _links;

  Future<void> loadAll() async {
    _isLoading = true;
    notifyListeners();
    try {
      await Future.wait([
        _fetchProjectsLocal(),
        _fetchTestimonialsLocal(),
        _loadLinksLocal(),
      ]);
    } catch (e, st) {
      log('LoadAll error: $e\n$st');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // -------- Projects ---------
  Future<void> fetchProjectsRemote() async {
    try {
      final response = await _projectsService.getProjects();
      _projects = (response as List).map((e) => Project.fromJson(e)).toList();
      notifyListeners();
    } catch (e) {
      log('Remote projects error: $e');
    }
  }

  Future<void> _fetchProjectsLocal() async {
    try {
      final contents = await rootBundle.loadString('assets/json/projects.json');
      final jsonData = jsonDecode(contents) as Map<String, dynamic>;
      _projects = (jsonData['projects'] as List)
          .map((e) => Project.fromJson(e))
          .toList();
    } catch (e) {
      log('Local projects error: $e');
    }
  }

  void addOrUpdateProject(Project p) {
    final idx = _projects.indexWhere((e) => e.id == p.id);
    if (idx == -1) {
      _projects.add(p);
    } else {
      _projects[idx] = p;
    }
    notifyListeners();
  }

  void deleteProject(int id) {
    _projects.removeWhere((e) => e.id == id);
    notifyListeners();
  }

  // -------- Testimonials ---------
  Future<void> _fetchTestimonialsLocal() async {
    try {
      final contents =
          await rootBundle.loadString('assets/json/testimonials.json');
      final jsonData = jsonDecode(contents) as Map<String, dynamic>;
      _testimonials = (jsonData['testimonials'] as List)
          .map((e) => Testimonial.fromJson(e))
          .toList();
    } catch (e) {
      log('Testimonials load error: $e');
    }
  }

  void addOrUpdateTestimonial(Testimonial t) {
    final idx = _testimonials.indexWhere((e) => e.id == t.id);
    if (idx == -1) {
      _testimonials.add(t);
    } else {
      _testimonials[idx] = t;
    }
    notifyListeners();
  }

  void deleteTestimonial(int id) {
    _testimonials.removeWhere((e) => e.id == id);
    notifyListeners();
  }

  // -------- Links ---------
  Future<void> _loadLinksLocal() async {
    // Placeholder: could load from a json file later
    _links = {
      'github': 'https://github.com/your-handle',
      'linkedin': 'https://linkedin.com/in/your-handle',
      'twitter': 'https://twitter.com/your-handle',
      'email': 'mailto:ephraim@example.com'
    };
  }

  void updateLink(String key, String value) {
    _links[key] = value;
    notifyListeners();
  }

  // Generate next IDs (simple incremental for local edits)
  int nextProjectId() =>
      (_projects.map((e) => e.id ?? 0).fold<int>(0, (p, c) => c > p ? c : p)) +
      1;
  int nextTestimonialId() =>
      (_testimonials.map((e) => e.id).fold<int>(0, (p, c) => c > p ? c : p)) +
      1;
}
