import 'package:flutter/material.dart';

class ProjectsProvider extends ChangeNotifier {
  bool _isLoading = false;
  bool get isLoading => _isLoading;
  
}