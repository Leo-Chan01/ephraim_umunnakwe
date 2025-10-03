import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/admin_provider.dart';
import '../models/portfolio_data.dart';
import '../theme/admin_theme.dart';

class ProjectsScreen extends StatefulWidget {
  const ProjectsScreen({super.key});

  @override
  State<ProjectsScreen> createState() => _ProjectsScreenState();
}

class _ProjectsScreenState extends State<ProjectsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Manage Projects'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showProjectDialog(context),
            tooltip: 'Add Project',
          ),
        ],
      ),
      body: Consumer<AdminProvider>(
        builder: (context, provider, child) {
          if (provider.projects.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.work_outline, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No projects yet', style: TextStyle(fontSize: 18)),
                  SizedBox(height: 8),
                  Text('Tap the + button to add your first project'),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: provider.projects.length,
            itemBuilder: (context, index) {
              final project = provider.projects[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 16),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              project.name,
                              style: Theme.of(context)
                                  .textTheme
                                  .titleLarge
                                  ?.copyWith(
                                    fontWeight: FontWeight.w600,
                                  ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: AdminTheme.getStatusColor(project.status)
                                  .withOpacity(0.1),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              project.status,
                              style: TextStyle(
                                color:
                                    AdminTheme.getStatusColor(project.status),
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          PopupMenuButton<String>(
                            onSelected: (value) {
                              switch (value) {
                                case 'edit':
                                  _showProjectDialog(context, project: project);
                                  break;
                                case 'delete':
                                  _deleteProject(context, project);
                                  break;
                              }
                            },
                            itemBuilder: (context) => [
                              const PopupMenuItem(
                                value: 'edit',
                                child: Row(
                                  children: [
                                    Icon(Icons.edit, size: 18),
                                    SizedBox(width: 8),
                                    Text('Edit'),
                                  ],
                                ),
                              ),
                              const PopupMenuItem(
                                value: 'delete',
                                child: Row(
                                  children: [
                                    Icon(Icons.delete,
                                        size: 18, color: Colors.red),
                                    SizedBox(width: 8),
                                    Text('Delete',
                                        style: TextStyle(color: Colors.red)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        project.description,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(Icons.calendar_today,
                              size: 16, color: Colors.grey[600]),
                          const SizedBox(width: 4),
                          Text(
                            '${project.startDate?.day}/${project.startDate?.month}/${project.startDate?.year}',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          if (project.endDate != null) ...[
                            const SizedBox(width: 8),
                            Icon(Icons.arrow_forward,
                                size: 12, color: Colors.grey[400]),
                            const SizedBox(width: 8),
                            Text(
                              '${project.endDate?.day}/${project.endDate?.month}/${project.endDate?.year}',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ] else ...[
                            const SizedBox(width: 8),
                            Text(
                              '(Ongoing)',
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                    fontStyle: FontStyle.italic,
                                    color: Colors.grey[500],
                                  ),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Icon(Icons.person_outline,
                              size: 16, color: Colors.grey[600]),
                          const SizedBox(width: 4),
                          Text(
                            project.role,
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          const SizedBox(width: 16),
                          Icon(Icons.flag_outlined,
                              size: 16, color: Colors.grey[600]),
                          const SizedBox(width: 4),
                          Text(
                            project.priority,
                            style: TextStyle(
                              color:
                                  AdminTheme.getPriorityColor(project.priority),
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        runSpacing: 4,
                        children: project.technologies.map((tech) {
                          return Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: AdminTheme.primaryColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              tech,
                              style: const TextStyle(
                                color: AdminTheme.primaryColor,
                                fontSize: 11,
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  void _showProjectDialog(BuildContext context, {Project? project}) {
    final nameController = TextEditingController(text: project?.name ?? '');
    final descriptionController =
        TextEditingController(text: project?.description ?? '');
    final roleController = TextEditingController(text: project?.role ?? '');
    final technologiesController = TextEditingController(
      text: project?.technologies.join(', ') ?? '',
    );

    String selectedStatus = project?.status ?? 'Planning';
    String selectedPriority = project?.priority ?? 'Medium';
    DateTime startDate = project?.startDate ?? DateTime.now();
    DateTime? endDate = project?.endDate;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: Text(project == null ? 'Add Project' : 'Edit Project'),
          content: SizedBox(
            width: 500,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: nameController,
                    decoration: const InputDecoration(
                      labelText: 'Project Name',
                      hintText: 'Enter project name',
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: descriptionController,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      labelText: 'Description',
                      hintText: 'Enter project description',
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: roleController,
                    decoration: const InputDecoration(
                      labelText: 'Your Role',
                      hintText: 'e.g., Full Stack Developer',
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: technologiesController,
                    decoration: const InputDecoration(
                      labelText: 'Technologies',
                      hintText: 'Flutter, React, Node.js (comma separated)',
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          initialValue: selectedStatus,
                          decoration:
                              const InputDecoration(labelText: 'Status'),
                          items: [
                            'Planning',
                            'In Progress',
                            'Completed',
                            'On Hold',
                            'Cancelled'
                          ]
                              .map((status) => DropdownMenuItem(
                                    value: status,
                                    child: Text(status),
                                  ))
                              .toList(),
                          onChanged: (value) {
                            if (value != null) {
                              setState(() {
                                selectedStatus = value;
                              });
                            }
                          },
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          initialValue: selectedPriority,
                          decoration:
                              const InputDecoration(labelText: 'Priority'),
                          items: ['Low', 'Medium', 'High']
                              .map((priority) => DropdownMenuItem(
                                    value: priority,
                                    child: Text(priority),
                                  ))
                              .toList(),
                          onChanged: (value) {
                            if (value != null) {
                              setState(() {
                                selectedPriority = value;
                              });
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: InkWell(
                          onTap: () async {
                            final date = await showDatePicker(
                              context: context,
                              initialDate: startDate,
                              firstDate: DateTime(2020),
                              lastDate: DateTime(2030),
                            );
                            if (date != null) {
                              setState(() {
                                startDate = date;
                              });
                            }
                          },
                          child: InputDecorator(
                            decoration: const InputDecoration(
                              labelText: 'Start Date',
                              suffixIcon: Icon(Icons.calendar_today),
                            ),
                            child: Text(
                              '${startDate.day}/${startDate.month}/${startDate.year}',
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: InkWell(
                          onTap: () async {
                            final date = await showDatePicker(
                              context: context,
                              initialDate: endDate ?? DateTime.now(),
                              firstDate: startDate,
                              lastDate: DateTime(2030),
                            );
                            if (date != null) {
                              setState(() {
                                endDate = date;
                              });
                            }
                          },
                          child: InputDecorator(
                            decoration: InputDecoration(
                              labelText: 'End Date (Optional)',
                              suffixIcon: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  if (endDate != null)
                                    IconButton(
                                      icon: const Icon(Icons.clear, size: 16),
                                      onPressed: () {
                                        setState(() {
                                          endDate = null;
                                        });
                                      },
                                    ),
                                  const Icon(Icons.calendar_today),
                                ],
                              ),
                            ),
                            child: Text(
                              endDate != null
                                  ? '${endDate!.day}/${endDate!.month}/${endDate!.year}'
                                  : 'Select end date',
                              style: TextStyle(
                                color: endDate != null
                                    ? Theme.of(context)
                                        .textTheme
                                        .bodyMedium
                                        ?.color
                                    : Theme.of(context).hintColor,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                if (nameController.text.isNotEmpty) {
                  final newProject = Project(
                    id: project?.id,
                    name: nameController.text,
                    description: descriptionController.text,
                    role: roleController.text,
                    status: selectedStatus,
                    priority: selectedPriority,
                    startDate: startDate,
                    endDate: endDate,
                    technologies: technologiesController.text
                        .split(',')
                        .map((e) => e.trim())
                        .where((e) => e.isNotEmpty)
                        .toList(),
                  );

                  final provider =
                      Provider.of<AdminProvider>(context, listen: false);
                  if (project == null) {
                    provider.addProject(newProject);
                  } else {
                    provider.updateProject(newProject);
                  }
                  Navigator.of(context).pop();
                }
              },
              child: Text(project == null ? 'Add' : 'Update'),
            ),
          ],
        ),
      ),
    );
  }

  void _deleteProject(BuildContext context, Project project) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Project'),
        content: Text('Are you sure you want to delete "${project.name}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Provider.of<AdminProvider>(context, listen: false)
                  .deleteProject(project.id!);
              Navigator.of(context).pop();
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
