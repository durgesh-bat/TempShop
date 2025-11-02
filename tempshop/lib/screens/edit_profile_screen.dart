import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../providers/auth_provider.dart';
import '../services/auth_service.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late TextEditingController _usernameController;
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;
  File? _imageFile;
  String? _currentImageUrl;
  bool _loading = false;
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _usernameController = TextEditingController();
    _firstNameController = TextEditingController();
    _lastNameController = TextEditingController();
    _emailController = TextEditingController();
    _phoneController = TextEditingController();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (auth.token == null) return;
    
    final result = await AuthService().getProfile(auth.token!);
    if (result['success'] && mounted) {
      final data = result['data'];
      setState(() {
        _usernameController.text = data['username'] ?? '';
        _firstNameController.text = data['first_name'] ?? '';
        _lastNameController.text = data['last_name'] ?? '';
        _emailController.text = data['email'] ?? '';
        _phoneController.text = data['phone_number'] ?? '';
        _currentImageUrl = data['profile_picture'];
      });
    }
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 512,
        maxHeight: 512,
        imageQuality: 85,
      );
      if (image != null && mounted) {
        setState(() => _imageFile = File(image.path));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to pick image: ${e.toString()}')),
        );
      }
    }
  }

  String? _validateUsername(String value) {
    if (value.isEmpty) return null;
    if (value.length < 3 || value.length > 30) return 'Username must be 3-30 characters';
    if (!RegExp(r'^[a-zA-Z0-9_-]+$').hasMatch(value)) return 'Only letters, numbers, _ and - allowed';
    return null;
  }

  String? _validatePhone(String value) {
    if (value.isEmpty) return null;
    final cleaned = value.replaceAll(RegExp(r'[\s\-\(\)]'), '');
    if (!RegExp(r'^\+?[0-9]{10,15}$').hasMatch(cleaned)) return 'Invalid phone number';
    return null;
  }

  Future<void> _saveProfile() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (auth.token == null) return;

    final usernameError = _validateUsername(_usernameController.text);
    if (usernameError != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(usernameError)));
      return;
    }

    final phoneError = _validatePhone(_phoneController.text);
    if (phoneError != null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(phoneError)));
      return;
    }

    if (!mounted) return;
    setState(() => _loading = true);
    
    final data = <String, dynamic>{};
    if (_usernameController.text.isNotEmpty) data['username'] = _usernameController.text;
    if (_firstNameController.text.isNotEmpty) data['first_name'] = _firstNameController.text;
    if (_lastNameController.text.isNotEmpty) data['last_name'] = _lastNameController.text;
    if (_emailController.text.isNotEmpty) data['email'] = _emailController.text;
    if (_phoneController.text.isNotEmpty) data['phone_number'] = _phoneController.text;
    
    final result = await AuthService().updateProfile(auth.token!, data, _imageFile);
    if (!mounted) return;
    
    setState(() => _loading = false);
    if (result['success']) {
      await auth.checkAuthStatus();
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Profile updated successfully'), backgroundColor: Colors.green),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'])),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFF9FAFB), Color(0xFFF3F4F6)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back),
                      onPressed: () => Navigator.pop(context),
                    ),
                    const Text('Edit Profile', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Container(
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Stack(
                          children: [
                            _imageFile != null
                                ? ClipOval(
                                    child: Image.file(
                                      _imageFile!,
                                      width: 120,
                                      height: 120,
                                      fit: BoxFit.cover,
                                    ),
                                  )
                                : (_currentImageUrl != null && _currentImageUrl!.isNotEmpty)
                                    ? ClipOval(
                                        child: CachedNetworkImage(
                                          imageUrl: _currentImageUrl!,
                                          width: 120,
                                          height: 120,
                                          fit: BoxFit.cover,
                                          placeholder: (context, url) => CircleAvatar(
                                            radius: 60,
                                            backgroundColor: const Color(0xFF2563EB),
                                            child: CircularProgressIndicator(
                                              strokeWidth: 2,
                                              color: Colors.white,
                                            ),
                                          ),
                                          errorWidget: (context, url, error) => CircleAvatar(
                                            radius: 60,
                                            backgroundColor: const Color(0xFF2563EB),
                                            child: Consumer<AuthProvider>(
                                              builder: (context, auth, _) => Text(
                                                (auth.username ?? 'U')[0].toUpperCase(),
                                                style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: Colors.white),
                                              ),
                                            ),
                                          ),
                                        ),
                                      )
                                    : CircleAvatar(
                                        radius: 60,
                                        backgroundColor: const Color(0xFF2563EB),
                                        child: Consumer<AuthProvider>(
                                          builder: (context, auth, _) => Text(
                                            (auth.username ?? 'U')[0].toUpperCase(),
                                            style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: Colors.white),
                                          ),
                                        ),
                                      ),
                            Positioned(
                              bottom: 0,
                              right: 0,
                              child: GestureDetector(
                                onTap: _pickImage,
                                child: Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF2563EB),
                                    shape: BoxShape.circle,
                                    border: Border.all(color: Colors.white, width: 3),
                                  ),
                                  child: const Icon(Icons.camera_alt, size: 20, color: Colors.white),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 32),
                        _buildTextField('Username', _usernameController, Icons.alternate_email),
                        const SizedBox(height: 16),
                        _buildTextField('First Name', _firstNameController, Icons.person),
                        const SizedBox(height: 16),
                        _buildTextField('Last Name', _lastNameController, Icons.person_outline),
                        const SizedBox(height: 16),
                        _buildTextField('Email Address', _emailController, Icons.email),
                        const SizedBox(height: 16),
                        _buildTextField('Phone Number', _phoneController, Icons.phone, keyboardType: TextInputType.phone),
                        const SizedBox(height: 32),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _loading ? null : _saveProfile,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF2563EB),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            child: _loading
                                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                : const Text('Save Changes', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon, {TextInputType? keyboardType}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Color(0xFF374151), fontWeight: FontWeight.w600, fontSize: 14)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          style: const TextStyle(color: Colors.black),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: const Color(0xFF6B7280)),
            filled: true,
            fillColor: const Color(0xFFF9FAFB),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF2563EB), width: 2),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          ),
        ),
      ],
    );
  }
}
