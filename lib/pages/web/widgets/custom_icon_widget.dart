import 'package:flutter/material.dart';

class CustomIconWidget extends StatelessWidget {
  final Function()? onClick;
  final IconData icon;
  final Color color;
  const CustomIconWidget(
      {super.key,
      this.onClick,
      required this.icon,
      required,
      required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(border: Border.all(color: color, width: 2)),
      child: InkWell(
        onHover: (value) {
          if (value = true) {}
        },
        onTap: (onClick != null) ? onClick : null,
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Icon(
            icon,
            color: color,
          ),
        ),
      ),
    );
  }
}
