import 'dart:math';

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

bool areWeMobile(BuildContext context) {
  var width = MediaQuery.of(context).size.width;
  // const maxWebAppRatio = 4.8 / 6.0;
  // const minWebAppRatio = 9.0 / 16.0;
  if (width >= 600) {
  } else {}
  return true;
}

double getCurrentViewHeight(BuildContext context) {
  var height = MediaQuery.of(context).size.height;
  return height;
}

double getCurrentViewWidth(BuildContext context) {
  var width = MediaQuery.of(context).size.height;
  return width;
}

int getRandomSelection({required int limit}) {
  return Random().nextInt(limit);
}

openLink(String? url) async {
  if (url != null) {
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    } else {
      await launchUrl(Uri.parse('https://thephenomenalephraim.web.app'));
    }
  } else {
    await launchUrl(Uri.parse(url ?? 'https://thephenomenalephraim.web.app'));
  }
}
