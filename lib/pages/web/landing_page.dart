import 'package:ephraim_umunnakwe/pages/web/desktop_view.dart';
import 'package:ephraim_umunnakwe/pages/web/mobile_view.dart';
import 'package:flutter/material.dart';

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
      if (constraints.maxWidth < 600) {
        return const MobileView(title: 'Mobile Mode');
      } else {
        return const DesktopView(
          title: 'Desktop Mode',
        );
      }
    });
  }
}
