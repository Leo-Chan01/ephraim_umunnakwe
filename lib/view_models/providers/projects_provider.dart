import 'dart:convert';
import 'dart:developer';
import 'package:ephraim_umunnakwe/models/project_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ProjectsProvider extends ChangeNotifier {
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  List<Project> _projects = [];
  List<Project> get projects => _projects;

  Future<List<Project>> fetchProjects() async {
    _isLoading = true;
    notifyListeners();

    try {
      final String contents = await _readJsonFile();

      log('JSON contents: $contents');

      final Map<String, dynamic> jsonData = jsonDecode(contents);

      await Future.delayed(const Duration(seconds: 2));

      List<Project> projects = (jsonData['projects'] as List)
          .map((data) => Project.fromJson(data))
          .toList();

      _projects = projects;
      notifyListeners();
      return projects;
    } catch (e) {
      log('Error reading JSON file: $e');
      return [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<String> _readJsonFile() async {
    return await rootBundle.loadString('assets/json/projects.json');
  }
}
