import 'package:flutter/material.dart';

class SiteStateProvider extends ChangeNotifier {
  bool _isHovering = false;
  bool get isHovering => _isHovering;

  updateHoveringState(bool currentState, int currentId, {index}) {
    if (index == currentId) {
      _isHovering = currentState;
      notifyListeners();
    } else {
      _isHovering = currentState;
      notifyListeners();
    }
  }
}
