import 'package:flutter/material.dart';

class ExpandingTextWidget extends StatefulWidget {
  final String text;
  final int truncationLength;
  final TextStyle? widgetStyle;

  const ExpandingTextWidget(
      {super.key,
      required this.text,
      required this.truncationLength,
      this.widgetStyle});

  @override
  State<ExpandingTextWidget> createState() => _ExpandingTextWidgetState();
}

class _ExpandingTextWidgetState extends State<ExpandingTextWidget> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    // const int widget.truncationLength = 100;

    String firstHalf;
    String secondHalf;

    if (widget.text.length > widget.truncationLength) {
      firstHalf = widget.text.substring(0, widget.truncationLength);
      secondHalf =
          widget.text.substring(widget.truncationLength, widget.text.length);
    } else {
      firstHalf = widget.text;
      secondHalf = "";
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text(
          _isExpanded ? (firstHalf + secondHalf) : ('$firstHalf...'),
          style: (widget.widgetStyle != null)
              ? widget.widgetStyle
              : Theme.of(context).textTheme.bodyLarge,
        ),
        const SizedBox(height: 10),
        secondHalf.isEmpty
            ? Container()
            : InkWell(
                child: Text(
                  _isExpanded ? "See Less" : "See More",
                  style: Theme.of(context)
                      .textTheme
                      .labelLarge!
                      .copyWith(color: Colors.blue),
                ),
                onTap: () {
                  setState(() {
                    _isExpanded = !_isExpanded;
                  });
                },
              ),
      ],
    );
  }
}
