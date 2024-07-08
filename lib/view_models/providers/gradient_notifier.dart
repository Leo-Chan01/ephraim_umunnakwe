import 'package:flutter/material.dart';

class GradientNotifier extends ChangeNotifier {
  List<Color> _colors = [Colors.blue, Colors.red];

  List<Color> get colors => _colors;

  void updateColors(List<Color> newColors) {
    _colors = newColors;
    notifyListeners();
  }
}
