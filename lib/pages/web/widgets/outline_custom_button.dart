import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class CustomOutlinedButton extends StatelessWidget {
  final String title;
  final Widget icon;
  final String direction;
  final Color backgroundColor;
  final Color shadowColor;
  final MaterialAccentColor outlineColor;
  final Color textColor;

  const CustomOutlinedButton({
    super.key,
    required this.title,
    required this.icon,
    required this.direction,
    required this.backgroundColor,
    required this.shadowColor,
    required this.outlineColor,
    required this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    var desktopWidth = MediaQuery.of(context).size.width;
    bool isMobile = desktopWidth < 600;
    return isMobile
        ? SizedBox(
            width: MediaQuery.of(context).size.width / 3,
            height: 55,
            child: Material(
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
              elevation: 0,
              color: backgroundColor,
              shadowColor: shadowColor,
              child: OutlinedButton.icon(
                onPressed: () {
                  context.push(direction);
                },
                icon: icon,
                label: SelectableText(
                  title,
                  textScaler: const TextScaler.linear(0.8),
                  style: Theme.of(context).textTheme.bodyLarge!.copyWith(
                      color: textColor,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'Avenir'),
                ),
                style: ButtonStyle(
                    elevation: WidgetStateProperty.all(10),
                    side: WidgetStateProperty.all(
                        BorderSide(color: outlineColor, width: 4)),
                    padding: WidgetStateProperty.all(
                        const EdgeInsets.symmetric(horizontal: 24)),
                    shape: const WidgetStatePropertyAll(RoundedRectangleBorder(
                        borderRadius: BorderRadius.zero))),
              ),
            ),
          )
        : SizedBox(
            width: 200,
            height: 100,
            child: Material(
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(0)),
              elevation: 0,
              color: backgroundColor,
              shadowColor: shadowColor,
              child: OutlinedButton.icon(
                onPressed: () {
                  context.push(direction);
                },
                icon: icon,
                label: SelectableText(
                  title,
                  textScaler: const TextScaler.linear(0.8),
                  style: Theme.of(context).textTheme.bodyLarge!.copyWith(
                      color: textColor,
                      fontWeight: FontWeight.bold,
                      fontFamily: 'Avenir'),
                ),
                style: ButtonStyle(
                    elevation: WidgetStateProperty.all(10),
                    side: WidgetStateProperty.all(
                        BorderSide(color: outlineColor, width: 4)),
                    padding: WidgetStateProperty.all(
                        const EdgeInsets.symmetric(horizontal: 24)),
                    shape: const WidgetStatePropertyAll(RoundedRectangleBorder(
                        borderRadius: BorderRadius.zero))),
              ),
            ),
          );
  }
}
