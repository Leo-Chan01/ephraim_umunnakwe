import 'package:ephraim_umunnakwe/pages/web/widgets/modern_body_content.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/modern_footer.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/gradient_container.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/modern_header.dart';
import 'package:flutter/material.dart';

class MobileView extends StatelessWidget {
  const MobileView({super.key, required String title});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: GradientContainer(
        includeStars: true,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.max,
            children: [
              ModernHeader(isDesktop: false),
              SizedBox(height: 20),
              Align(
                  alignment: Alignment.center,
                  child: ModernBodyContent(isDesktop: false)),
              SizedBox(height: 20),
              Align(
                  alignment: Alignment.bottomCenter,
                  child: ModernFooter(isDesktop: false)),
            ],
          ),
        ),
      ),
    );
  }
}
