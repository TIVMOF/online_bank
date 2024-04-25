import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import '../utill/my_transaction.dart';
import '../utill/read_more.dart';
import '../utill/app_bar.dart';
import '../utill/bottom_app_bar.dart';

class TransactionPage extends StatefulWidget {
  final String fullName;
  final int userId;

  const TransactionPage({
    Key? key,
    required this.fullName,
    required this.userId,
  }) : super(key: key);

  @override
  State<TransactionPage> createState() => _TransactionPageState();
}

class _TransactionPageState extends State<TransactionPage> {
  final _controller = PageController();
  final basicAuth = 'Basic ' + base64Encode(utf8.encode('admin:admin'));
  var sessionTransactions = [];

  @override
  void initState() {
    super.initState();
    _fetchData(); // Fetch data when the page initializes
  }

  Future<void> _fetchData() async {
    try {
      final response = await http.post(
        Uri.parse(
          'http://113.30.151.151:8080/services/js/dirigible-bank-server-api/transactions.js/getTransactionsByUser',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': basicAuth,
        },
        body: json.encode({'Id': widget.userId}),
      );

      if (response.statusCode == 200) {
        setState(() {
          sessionTransactions = jsonDecode(response.body);
          log("$sessionTransactions");
        });
      } else {
        _showSnackBar("Could not access transactions!");
      }
    } catch (e) {
      _showSnackBar("An error occurred while fetching transactions.");
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
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
            MyAppBar(first_name: 'Трансакции', second_name: ''),
            MyRead(
                content: 'Скорошни трансакции',
                trimLines: 2,
                align: TextAlign.center,
                size: 25,
                weight: FontWeight.bold),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(right: 5),
                child: Scrollbar(
                  controller: _controller,
                  child: ListView(
                      scrollDirection: Axis.vertical,
                      controller: _controller,
                      children: sessionTransactions.isNotEmpty
                          ? sessionTransactions.map((transaction) {
                              return MyTransaction(
                                date: transaction["Date"].toString(),
                                recipient: transaction["Receiver"].toString(),
                                sender: transaction["Sender"].toString(),
                                sum: transaction["Amount"].toString(),
                                sentOrReceived:
                                    transaction["Receiver"].toString() ==
                                        widget.fullName,
                              );
                            }).toList()
                          : [
                              Center(child: Text("No transactions!")),
                            ]),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
