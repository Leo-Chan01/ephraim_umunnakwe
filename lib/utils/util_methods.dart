import 'package:flutter/material.dart';

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
