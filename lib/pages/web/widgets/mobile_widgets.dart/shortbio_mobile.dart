import 'package:avatar_glow/avatar_glow.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/mobile_widgets.dart/textbio_mobile.dart';
import 'package:ephraim_umunnakwe/utils/util_methods.dart';
import 'package:flutter/material.dart';

class MyShortBioSectionMobile extends StatelessWidget {
  const MyShortBioSectionMobile({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: getCurrentViewHeight(context),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          MouseRegion(
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
          const SizedBox(height: 80),
          const TextBioMobile(),
        ],
      ),
    );
  }
}
