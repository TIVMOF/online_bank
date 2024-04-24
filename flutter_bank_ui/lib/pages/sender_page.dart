// ignore_for_file: unused_import
import 'package:flutter/material.dart';
import 'package:online_bank/utill/bottom_app_bar.dart';

class SenderPage extends StatefulWidget {
  final String fullName;
  final int userId;

  const SenderPage({super.key, required this.fullName, required this.userId});

  @override
  State<SenderPage> createState() => _SenderPageState();
}

class _SenderPageState extends State<SenderPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: AppBarBottom(
          context: context, fullName: widget.fullName, userId: widget.userId),
    );
  }
}
