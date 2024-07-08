import 'dart:developer';

import 'package:avatar_glow/avatar_glow.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/custom_buttons.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/mobile_widgets.dart/shortbio_mobile.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/text_bio_widget.dart';
import 'package:ephraim_umunnakwe/utils/list_utility.dart';
import 'package:ephraim_umunnakwe/utils/util_methods.dart';
import 'package:ephraim_umunnakwe/view_models/providers/site_state_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_rating_stars/flutter_rating_stars.dart';
import 'package:provider/provider.dart';
import 'feature_card.dart';

class BodyContent extends StatelessWidget {
  final bool isDesktop;
  const BodyContent({super.key, required this.isDesktop});

  @override
  Widget build(BuildContext context) {
    return Consumer<SiteStateProvider>(builder: (context, siteState, child) {
      return Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            isDesktop
                ? const MyShortBioSection()
                : const MyShortBioSectionMobile(),
            const SizedBox(height: 80),
            Text('Cut to the Chase?',
                style: Theme.of(context)
                    .textTheme
                    .titleLarge!
                    .copyWith(color: Colors.white, fontFamily: "Genome")),
            const SizedBox(height: 20),
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
            const SizedBox(height: 5),
            Text('My people say "Show working!", here is a tip of the iceberg',
                style: Theme.of(context)
                    .textTheme
                    .titleLarge!
                    .copyWith(color: Colors.white, fontFamily: "Genome")),
            const SizedBox(height: 20),
            const TestimonialCarousel(),
            const SizedBox(height: 80),
            const Divider(),
            const SizedBox(height: 20),
            Text('Click here to learn more or hire me',
                style: Theme.of(context)
                    .textTheme
                    .titleLarge!
                    .copyWith(color: Colors.white, fontFamily: "Genome")),
          ],
        ),
      );
    });
  }
}

class TestimonialCarousel extends StatelessWidget {
  const TestimonialCarousel({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return CarouselSlider.builder(
      itemCount: 15,
      itemBuilder: (BuildContext context, int itemIndex, int pageViewIndex) {
        return Container(
          decoration: BoxDecoration(
              color: Colors.white, borderRadius: BorderRadius.circular(10)),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Image.asset("assets/images/profile_img.jpg")),
              const SizedBox(height: 40),
              const StarRating(),
              const SizedBox(height: 20),
              Text(
                "Ephraim Umunnakwe",
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 5),
              Text(
                "(Software Engineer at Raym Universe Ltd)",
                style: Theme.of(context)
                    .textTheme
                    .bodyMedium!
                    .copyWith(fontStyle: FontStyle.italic),
              ),
              const SizedBox(height: 20),
              Text(
                'A very fantastic dev to work with',
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context)
                    .textTheme
                    .bodyLarge!
                    .copyWith(color: Colors.black, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        );
      },
      options: CarouselOptions(
          autoPlay: true, height: getCurrentViewHeight(context)),
    );
  }
}

class StarRating extends StatelessWidget {
  const StarRating({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return RatingStars(
      axis: Axis.horizontal,
      value: 4,
      onValueChanged: (v) {
        //
        // setState(() {
        //   value = v;
        // });
      },
      starCount: 5,
      starSize: 20,
      valueLabelColor: const Color(0xff9b9b9b),
      valueLabelTextStyle: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w400,
          fontStyle: FontStyle.normal,
          fontSize: 12.0),
      valueLabelRadius: 10,
      maxValue: 5,
      starSpacing: 2,
      maxValueVisibility: true,
      valueLabelVisibility: true,
      animationDuration: const Duration(milliseconds: 1000),
      valueLabelPadding: const EdgeInsets.symmetric(vertical: 1, horizontal: 8),
      valueLabelMargin: const EdgeInsets.only(right: 8),
      starOffColor: const Color(0xffe7e8ea),
      starColor: Colors.yellow,
      angle: 12,
      starBuilder: (index, color) {
        return Icon(
          Icons.star,
          color: color,
        );
      },
    );
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
