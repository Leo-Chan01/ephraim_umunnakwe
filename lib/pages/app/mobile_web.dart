import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'dart:ui' as ui;

class MobileDesignWidget extends StatelessWidget {
  final maxWebAppRatio = 4.8 / 6.0;
  final minWebAppRatio = 9.0 / 16.0;

  final Widget child;

  const MobileDesignWidget({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxHeight < constraints.maxWidth) {
          return Container(
            alignment: Alignment.center,
            child: ClipRect(
              child: AspectRatio(
                aspectRatio: getCurrentWebAppRatio(),
                child: child,
              ),
            ),
          );
        }
        return child;
      },
    );
  }

  double getCurrentWebAppRatio() {
    double currentWebAppRatio = minWebAppRatio;

    // Fixed ratio for Web
    // ignore: deprecated_member_use
    var physicalScreenSize = ui.window.physicalSize;
    var physicalWidth = physicalScreenSize.width;
    var physicalHeight = physicalScreenSize.height;

    currentWebAppRatio = physicalWidth / physicalHeight;
    if (currentWebAppRatio > maxWebAppRatio) {
      currentWebAppRatio = maxWebAppRatio;
    } else if (currentWebAppRatio < minWebAppRatio) {
      currentWebAppRatio = minWebAppRatio;
    }
    return currentWebAppRatio;
  }
}
