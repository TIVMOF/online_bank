// ignore_for_file: prefer_const_literals_to_create_immutables, prefer_const_constructors, sized_box_for_whitespace

import 'package:flutter/material.dart';
import 'pay_page.dart';
import 'statistics_page.dart';
import 'transaction_page.dart';
import '../utill/app_bar.dart';
import '../utill/bottom_app_bar.dart';
import '../utill/my_button.dart';
import '../utill/my_card.dart';
import '../utill/my_list_tile.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:online_bank/pages/send_page.dart';

import 'bills_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _controller = PageController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: AppBarBottom(context: context),
      body: SafeArea(
        child: Column(
          children: [
            // app bar
            MyAppBar(first_name: 'Proper Invest', second_name: 'Bank'),

            SizedBox(
              height: 25,
            ),

            // cards
            Container(
                height: 180,
                child: PageView(
                  scrollDirection: Axis.horizontal,
                  controller: _controller,
                  children: [
                    MyCard(
                      balance: 5250.20,
                      cardNumber: 12345678,
                      expiryDate: 4,
                      expiryMonth: 10,
                      expiryYear: 24,
                      color: Colors.deepPurple,
                    ),
                    MyCard(
                      balance: 4250.24,
                      cardNumber: 11345678,
                      expiryDate: 5,
                      expiryMonth: 11,
                      expiryYear: 23,
                      color: Colors.deepOrange,
                    ),
                    MyCard(
                      balance: 250.99,
                      cardNumber: 12355678,
                      expiryDate: 3,
                      expiryMonth: 12,
                      expiryYear: 25,
                      color: Colors.blue,
                    ),
                  ],
                )),

            SizedBox(height: 15),

            SmoothPageIndicator(
              controller: _controller,
              count: 3,
              effect: ExpandingDotsEffect(
                activeDotColor: Colors.blue.shade900,
              ),
            ),

            SizedBox(height: 20),

            // 3 buttons ->send + pay + bills
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 25.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // send button
                  MyButton(
                    iconImagePath: 'lib/icons/send.png',
                    buttonText: 'Прати',
                    page: SendPage(context: context),
                    is_paying: false,
                  ),

                  //pay button
                  MyButton(
                    iconImagePath: 'lib/icons/credit-card.png',
                    buttonText: 'Плати',
                    page: PayPage(context: context),
                    is_paying: true,
                  ),

                  //bills button
                  MyButton(
                    iconImagePath: 'lib/icons/bill.png',
                    buttonText: 'Сметки',
                    page: BillsPage(context: context),
                    is_paying: false,
                  ),
                ],
              ),
            ),

            SizedBox(height: 20),

            // column -> stats + transaction
            Padding(
              padding: const EdgeInsets.all(25.0),
              child: Column(
                children: [
                  //Stats
                  MyListTile(
                    iconImagePath: 'lib/icons/statistics.png',
                    tileTitle: 'Статистики',
                    tileSubtitle: 'Разплащания',
                    page: StatsPage(),
                  ),

                  //Transactions
                  MyListTile(
                    iconImagePath: 'lib/icons/lending.png',
                    tileTitle: 'Трансакции',
                    tileSubtitle: 'История',
                    page: TransactionPage(),
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
