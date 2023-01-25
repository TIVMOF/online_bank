import "package:flutter/material.dart";
import 'package:online_bank/utill/bottom_app_bar.dart';

class AboutPage extends StatelessWidget {
  final BuildContext context;

  const AboutPage({
    required this.context
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: AppBarBottom(context: this.context),
    );
  }
}