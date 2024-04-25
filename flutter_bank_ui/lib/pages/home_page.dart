// ignore_for_file: prefer_const_literals_to_create_immutables, prefer_const_constructors, sized_box_for_whitespace, unused_import
import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:online_bank/pages/sender_page.dart';
import 'statistics_page.dart';
import 'transaction_page.dart';
import '../utill/app_bar.dart';
import '../utill/bottom_app_bar.dart';
import '../utill/my_card.dart';
import '../utill/my_list_tile.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class HomePage extends StatefulWidget {
  final String fullName;
  final int userId;

  const HomePage({required this.fullName, super.key, required this.userId});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _controller = PageController();
  final basicAuth = 'Basic ' + base64Encode(utf8.encode('admin:admin'));
  var sessionCards = [];
  var sessionAccounts = [];

  @override
  void initState() {
    super.initState();
    _fetchData(); // Fetch data when the page initializes
  }

  Future<void> _fetchData() async {
    final basicAuth = 'Basic ' + base64Encode(utf8.encode('admin:admin'));

    try {
      final response = await http.post(
        Uri.parse(
          'http://113.30.151.151:8080/services/js/dirigible-bank-server-api/card.js/getCards',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': basicAuth,
        },
        body: json.encode({
          'Id': widget.userId, // Use widget to access parameters from parent
        }),
      );

      if (response.statusCode == 200) {
        sessionCards = jsonDecode(response.body);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Could not access cards!")),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("An error occurred while fetching data.")),
      );
    }

    try {
      final response = await http.post(
        Uri.parse(
          'http://113.30.151.151:8080/services/js/dirigible-bank-server-api/bankAccounts.js/getAccountByUser',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': basicAuth,
        },
        body: json.encode({
          'Id': widget.userId, // Use widget to access parameters from parent
        }),
      );

      if (response.statusCode == 200) {
        sessionAccounts = jsonDecode(response.body);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Could not access Bank Accounts!")),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("An error occurred while fetching data.")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: AppBarBottom(
          context: context, fullName: widget.fullName, userId: widget.userId),
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
                  children: sessionCards.isNotEmpty
                      ? sessionCards.map((card) {
                          return MyCard(
                            balance: sessionAccounts[0]["Amount"],
                            cardNumber: card['CardNumber'],
                            expiryDate: 2,
                            expiryMonth: 4,
                            expiryYear: 2025,
                            color: Color.fromARGB(255, 17, 6, 213),
                          );
                        }).toList() // Convert mapped results to a list
                      : [
                          Center(
                              child: Text(
                                  "No cards available")), // Fallback when sessionData is empty
                        ],
                )),

            SizedBox(height: 15),

            SmoothPageIndicator(
              controller: _controller,
              count: sessionCards.length,
              effect: ExpandingDotsEffect(
                activeDotColor: Colors.blue.shade900,
              ),
            ),

            SizedBox(height: 20),

            // column -> stats + transaction
            Padding(
              padding: const EdgeInsets.all(25.0),
              child: Column(
                children: [
                  //Send
                  MyListTile(
                    iconImagePath: 'lib/icons/send.png',
                    tileTitle: 'Преводи',
                    tileSubtitle: 'Прати по сметка',
                    page: SenderPage(
                        fullName: widget.fullName, userId: widget.userId),
                  ),

                  //Stats
                  MyListTile(
                    iconImagePath: 'lib/icons/statistics.png',
                    tileTitle: 'Статистики',
                    tileSubtitle: 'Разплащания',
                    page: StatsPage(
                        fullName: widget.fullName, userId: widget.userId),
                  ),

                  //Transactions
                  MyListTile(
                    iconImagePath: 'lib/icons/lending.png',
                    tileTitle: 'Трансакции',
                    tileSubtitle: 'История',
                    page: TransactionPage(
                        fullName: widget.fullName, userId: widget.userId),
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
