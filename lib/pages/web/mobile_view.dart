import 'package:ephraim_umunnakwe/pages/web/widgets/body_content.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/footer.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/gradient_container.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/header.dart';
import 'package:flutter/material.dart';

class MobileView extends StatelessWidget {
  const MobileView({super.key, required String title});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: GradientContainer(
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.max,
            children: [
              Header(isDesktop: false),
              SizedBox(height: 80),
              Align(alignment: Alignment.center, child: BodyContent(isDesktop: false)),
              Align(alignment: Alignment.bottomCenter, child: Footer(isDesktop: false)),
            ],
          ),
        ),
      ),
    );
  }
}
