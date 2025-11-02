import 'package:flutter/material.dart';
import 'terms_of_service_screen.dart';
import 'privacy_policy_screen.dart';

class AgreementScreen extends StatefulWidget {
  final VoidCallback onAccept;
  
  const AgreementScreen({Key? key, required this.onAccept}) : super(key: key);

  @override
  State<AgreementScreen> createState() => _AgreementScreenState();
}

class _AgreementScreenState extends State<AgreementScreen> {
  bool _acceptedTerms = false;
  bool _acceptedPrivacy = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Agreement'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Welcome to TempShop',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            const Text(
              'Please review and accept our terms to continue:',
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 24),
            CheckboxListTile(
              value: _acceptedTerms,
              onChanged: (value) => setState(() => _acceptedTerms = value!),
              title: Row(
                children: [
                  const Text('I agree to the '),
                  GestureDetector(
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const TermsOfServiceScreen()),
                    ),
                    child: const Text(
                      'Terms of Service',
                      style: TextStyle(color: Colors.blue, decoration: TextDecoration.underline),
                    ),
                  ),
                ],
              ),
            ),
            CheckboxListTile(
              value: _acceptedPrivacy,
              onChanged: (value) => setState(() => _acceptedPrivacy = value!),
              title: Row(
                children: [
                  const Text('I agree to the '),
                  GestureDetector(
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const PrivacyPolicyScreen()),
                    ),
                    child: const Text(
                      'Privacy Policy',
                      style: TextStyle(color: Colors.blue, decoration: TextDecoration.underline),
                    ),
                  ),
                ],
              ),
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: (_acceptedTerms && _acceptedPrivacy) ? widget.onAccept : null,
                child: const Text('Continue'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}