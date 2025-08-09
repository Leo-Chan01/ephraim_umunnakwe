import 'dart:convert';
import 'dart:developer';
import 'dart:async';
import 'package:ephraim_umunnakwe/models/project_model.dart';
import 'package:ephraim_umunnakwe/models/testimonial_model.dart';
import 'package:ephraim_umunnakwe/view_models/api_service/projects_service.dart';
import 'package:ephraim_umunnakwe/services/portfolio_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class PortfolioDataProvider extends ChangeNotifier {
  final SupabaseProjectsService _projectsService;
  final PortfolioService _portfolioService = PortfolioService();

  PortfolioDataProvider(this._projectsService);

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  bool _isOnline = true;
  bool get isOnline => _isOnline;

  String? _lastError;
  String? get lastError => _lastError;

  // Subscription management
  StreamSubscription<List<Project>>? _projectsSubscription;
  StreamSubscription<List<Testimonial>>? _testimonialsSubscription;

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
    _lastError = null;
    notifyListeners();

    try {
      // Try to load from Supabase first
      await _loadFromSupabaseWithFallback();

      // If successful, set up real-time subscriptions
      _setupRealtimeSubscriptions();
    } catch (e, st) {
      log('LoadAll error: $e\n$st');
      _lastError = e.toString();

      // Fallback to local data
      await _loadFromLocal();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> _loadFromSupabaseWithFallback() async {
    try {
      // Test connection first
      await _testSupabaseConnection();

      // Load all data from Supabase
      await Future.wait([
        _fetchProjectsFromSupabase(),
        _fetchTestimonialsFromSupabase(),
        _loadLinksFromSupabase(),
      ]);

      _isOnline = true;
      log('Successfully loaded data from Supabase');
    } catch (e) {
      _isOnline = false;
      log('Supabase connection failed: $e');
      rethrow;
    }
  }

  Future<void> _testSupabaseConnection() async {
    try {
      // Simple query to test connection
      final client = Supabase.instance.client;
      await client.from('projects').select('id').limit(1);
    } catch (e) {
      throw Exception('Supabase connection test failed: $e');
    }
  }

  Future<void> _loadFromLocal() async {
    log('Loading from local fallback data...');
    try {
      await Future.wait([
        _fetchProjectsLocal(),
        _fetchTestimonialsLocal(),
        _loadLinksLocal(),
      ]);
      log('Successfully loaded local fallback data');
    } catch (e, st) {
      log('Local fallback also failed: $e\n$st');
      _lastError = 'Failed to load both remote and local data: $e';
    }
  }

  void _setupRealtimeSubscriptions() {
    if (!_isOnline) return;

    try {
      // Subscribe to projects updates
      _projectsSubscription?.cancel();
      _projectsSubscription = _portfolioService.subscribeToProjects().listen(
        (projects) {
          _projects = projects;
          notifyListeners();
          log('Real-time projects update received: ${projects.length} projects');
        },
        onError: (error) {
          log('Projects subscription error: $error');
          _lastError = 'Real-time sync error: $error';
          notifyListeners();
        },
      );

      // Subscribe to testimonials updates
      _testimonialsSubscription?.cancel();
      _testimonialsSubscription =
          _portfolioService.subscribeToTestimonials().listen(
        (testimonials) {
          _testimonials = testimonials;
          notifyListeners();
          log('Real-time testimonials update received: ${testimonials.length} testimonials');
        },
        onError: (error) {
          log('Testimonials subscription error: $error');
        },
      );

      log('Real-time subscriptions established');
    } catch (e) {
      log('Failed to setup real-time subscriptions: $e');
    }
  }

  // -------- Supabase Methods with Error Handling ---------
  Future<void> _fetchProjectsFromSupabase() async {
    try {
      _projects = await _portfolioService.getProjects();
      log('Fetched ${_projects.length} projects from Supabase');
      notifyListeners();
    } catch (e) {
      log('Error fetching projects from Supabase: $e');
      rethrow;
    }
  }

  Future<void> _fetchTestimonialsFromSupabase() async {
    try {
      _testimonials = await _portfolioService.getTestimonials();
      log('Fetched ${_testimonials.length} testimonials from Supabase');
      notifyListeners();
    } catch (e) {
      log('Error fetching testimonials from Supabase: $e');
      rethrow;
    }
  }

  Future<void> _loadLinksFromSupabase() async {
    try {
      _links = await _portfolioService.getSocialLinks();
      log('Fetched ${_links.length} social links from Supabase');
      notifyListeners();
    } catch (e) {
      log('Error fetching links from Supabase: $e');
      rethrow;
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

  // -------- Local Fallback Methods ---------
  Future<void> _fetchProjectsLocal() async {
    try {
      final contents = await rootBundle.loadString('assets/json/projects.json');
      final jsonData = jsonDecode(contents) as Map<String, dynamic>;
      _projects = (jsonData['projects'] as List)
          .map((e) => Project.fromJson(e))
          .toList();
      log('Loaded ${_projects.length} projects from local JSON');
      notifyListeners();
    } catch (e) {
      log('Local projects error: $e');
      // Initialize with empty list if local file fails
      _projects = [];
      notifyListeners();
    }
  }

  Future<void> _fetchTestimonialsLocal() async {
    try {
      final contents =
          await rootBundle.loadString('assets/json/testimonials.json');
      final jsonData = jsonDecode(contents) as Map<String, dynamic>;
      _testimonials = (jsonData['testimonials'] as List)
          .map((e) => Testimonial.fromJson(e))
          .toList();
      log('Loaded ${_testimonials.length} testimonials from local JSON');
      notifyListeners();
    } catch (e) {
      log('Local testimonials error: $e');
      // Initialize with empty list if local file fails
      _testimonials = [];
      notifyListeners();
    }
  }

  Future<void> _loadLinksLocal() async {
    try {
      final contents =
          await rootBundle.loadString('assets/json/social_links.json');
      final jsonData = jsonDecode(contents) as Map<String, dynamic>;
      _links = Map<String, String>.from(jsonData['links'] ?? {});
      log('Loaded ${_links.length} social links from local JSON');
      notifyListeners();
    } catch (e) {
      log('Local links error: $e');
      // Initialize with empty map if local file fails
      _links = {};
      notifyListeners();
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

  // -------- Testimonials Management ---------
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

  // -------- Links Management ---------
  void updateLink(String key, String value) {
    _links[key] = value;
    notifyListeners();
  }

  // -------- Utility Methods ---------
  int nextProjectId() =>
      (_projects.map((e) => e.id ?? 0).fold<int>(0, (p, c) => c > p ? c : p)) +
      1;

  int nextTestimonialId() =>
      (_testimonials.map((e) => e.id).fold<int>(0, (p, c) => c > p ? c : p)) +
      1;

  // -------- Cleanup ---------
  @override
  void dispose() {
    _projectsSubscription?.cancel();
    _testimonialsSubscription?.cancel();
    super.dispose();
  }

  // -------- Retry Methods ---------
  Future<void> retryLoadAll() async {
    _lastError = null;
    await loadAll();
  }

  void clearError() {
    _lastError = null;
    notifyListeners();
  }
}
