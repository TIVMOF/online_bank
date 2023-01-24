import "package:flutter/material.dart";
import "package:online_bank/pages/about_page.dart";
import "package:online_bank/pages/home_page.dart";
import 'package:online_bank/utill/bottom_app_bar.dart';

class SendPage extends StatelessWidget {
  final BuildContext context;
  
  const SendPage({
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