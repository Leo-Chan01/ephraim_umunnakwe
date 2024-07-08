import 'dart:developer';

import 'package:avatar_glow/avatar_glow.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/custom_buttons.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/text_bio_widget.dart';
import 'package:ephraim_umunnakwe/utils/list_utility.dart';
import 'package:ephraim_umunnakwe/utils/util_methods.dart';
import 'package:ephraim_umunnakwe/view_models/providers/site_state_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'feature_card.dart';

class BodyContent extends StatelessWidget {
  const BodyContent({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<SiteStateProvider>(builder: (context, siteState, child) {
      return Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const MyShortBioSection(),
            const SizedBox(height: 100),
            const CustomButtons(),
            const SizedBox(height: 80),
            const Divider(),
            const SizedBox(height: 80),
            Text('My Brand Promise',
                style: Theme.of(context)
                    .textTheme
                    .headlineMedium!
                    .copyWith(color: Colors.white)),
            const SizedBox(height: 20),
            SizedBox(
              child: Wrap(
                alignment: WrapAlignment.spaceBetween,
                runSpacing: 10,
                children: List.generate(brandPromiseList.length, (index) {
                  return MouseRegion(
                    onEnter: (event) {
                      log("Is hovering now");
                      siteState.updateHoveringState(
                          true, brandPromiseList[index].id,
                          index: index + 1);
                    },
                    onExit: (event) {
                      log("Is not hovering now");
                      siteState.updateHoveringState(
                          false, brandPromiseList[index].id,
                          index: index + 1);
                    },
                    child: FeatureCard(
                        icon: brandPromiseList[index].prandPromiseIcon,
                        title: brandPromiseList[index].title,
                        description: brandPromiseList[index].subTitle,
                        isFocused: siteState.isHovering),
                  );
                }),
              ),
            ),
            const SizedBox(height: 80),
            const Divider(),
            const SizedBox(height: 20),
            Text('What my Clients say',
                style: Theme.of(context)
                    .textTheme
                    .headlineMedium!
                    .copyWith(color: Colors.white)),
                    
          ],
        ),
      );
    });
  }
}

class MyShortBioSection extends StatelessWidget {
  const MyShortBioSection({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: getCurrentViewWidth(context),
      child: Row(
        mainAxisSize: MainAxisSize.max,
        children: [
          Expanded(
            flex: 2,
            child: MouseRegion(
              cursor: SystemMouseCursors.click,
              child: AvatarGlow(
                glowShape: BoxShape.rectangle,
                glowColor: const Color.fromARGB(255, 213, 216, 218),
                glowCount: 2,
                glowBorderRadius: BorderRadius.circular(
                    MediaQuery.of(context).size.shortestSide / 2),
                duration: const Duration(milliseconds: 2000),
                repeat: true,
                animate: true,
                // showTwoGlows: true,
                curve: Curves.fastOutSlowIn,
                // repeatPauseDuration: const Duration(milliseconds: 1000),
                child: Material(
                  elevation: 10.0,
                  shape: const CircleBorder(),
                  child: CircleAvatar(
                    backgroundColor: Colors.transparent,
                    minRadius: MediaQuery.of(context).size.shortestSide / 60,
                    maxRadius: MediaQuery.of(context).size.shortestSide / 10,
                    child: ClipRRect(
                        borderRadius: BorderRadius.circular(200.0),
                        child: Image.asset('assets/images/profile_img.jpg')),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 200),
          const Flexible(flex: 4, child: TextBioWidget()),
        ],
      ),
    );
  }
}
