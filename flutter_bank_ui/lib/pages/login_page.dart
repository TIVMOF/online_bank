import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'home_page.dart';
import 'dart:developer';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  final String basicAuth = 'Basic ' + base64Encode(utf8.encode('admin:admin'));

  Future<void> _login() async {
    final username = _usernameController.text.trim();
    final password = _passwordController.text.trim();

    if (username.isEmpty || password.isEmpty) {
      // Show an error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please enter both username and password")),
      );
      return;
    }

    final response = await http.post(
      Uri.parse(
          'http://113.30.151.151:8080/services/js/dirigible-bank-server-api/user.js/login'), // Adjust endpoint
      headers: {'Content-Type': 'application/json', 'Authorization': basicAuth},
      body: json.encode({
        'Username': username,
        'Password': password,
      }),
    );

    if (response.statusCode == 200) {
      final sessionData = jsonDecode(response.body);

      final fullName = "${sessionData['FName']} ${sessionData['LName']}";
      // Navigate to the Home Page
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) =>
              HomePage(fullName: fullName, userId: sessionData['Id']),
        ),
      );
    } else {
      log('data: $response.statusCode');
      // Login failed
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Login failed. Please try again.")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Login")),
      body: Padding(
        padding: const EdgeInsets.all(16), // Ensure padding is provided
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _usernameController,
              decoration: InputDecoration(labelText: "Username"),
            ),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: InputDecoration(labelText: "Password"),
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: _login,
              child: Text("Login"),
            ),
          ],
        ),
      ),
    );
  }
}
