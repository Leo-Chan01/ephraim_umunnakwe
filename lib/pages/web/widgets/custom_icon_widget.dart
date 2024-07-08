import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CustomIconWidget extends StatelessWidget {
  final Function()? onClick;
  final IconData icon;
  final Color color;
  final double? radius;
  const CustomIconWidget(
      {super.key,
      this.onClick,
      required this.icon,
      required,
      this.radius,
      required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
          border: Border.all(color: color, width: 2),
          borderRadius:
              (radius != null) ? BorderRadius.circular(radius!) : null),
      child: Center(
        child: InkWell(
          onHover: (value) {
            if (value = true) {}
          },
          onTap: (onClick != null) ? onClick : null,
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Center(
                child: Icon(
                  icon,
                  color: color,
                  size: 24.sp,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
