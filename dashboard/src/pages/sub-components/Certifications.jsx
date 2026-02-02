import { useState } from "react";
import { Award, Calendar, ExternalLink, Plus, Trash2, Edit2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

const Certifications = () => {
  const [certifications, setCertifications] = useState([
    {
      id: 1,
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-11-15",
      credentialUrl: "https://aws.amazon.com/certification",
      description: "Professional level certification for AWS architecture",
    },
    {
      id: 2,
      title: "React Advanced Certification",
      issuer: "Meta",
      date: "2023-08-22",
      credentialUrl: "https://react.dev",
      description: "Advanced React patterns and performance optimization",
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    credentialUrl: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.issuer || !formData.date) {
      toast.error("Please fill in required fields: Title, Issuer, and Date");
      return;
    }

    if (editingId) {
      // Update existing certification
      setCertifications(prev => 
        prev.map(cert => 
          cert.id === editingId ? { ...formData, id: editingId } : cert
        )
      );
      toast.success("Certification updated successfully!");
      setEditingId(null);
    } else {
      // Add new certification
      const newCert = {
        ...formData,
        id: Date.now(),
      };
      setCertifications(prev => [newCert, ...prev]);
      toast.success("Certification added successfully!");
    }

    // Reset form
    setFormData({
      title: "",
      issuer: "",
      date: "",
      credentialUrl: "",
      description: "",
    });
    setIsAdding(false);
  };

  const handleEdit = (cert) => {
    setFormData(cert);
    setEditingId(cert.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      setCertifications(prev => prev.filter(cert => cert.id !== id));
      toast.success("Certification deleted!");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Certifications</h2>
          <p className="text-muted-foreground">
            Manage your professional certifications and credentials
          </p>
        </div>
        <Button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({
              title: "",
              issuer: "",
              date: "",
              credentialUrl: "",
              description: "",
            });
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Certification
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Certification" : "Add New Certification"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Certification Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., AWS Certified Solutions Architect"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="issuer" className="text-sm font-medium">
                  Issuing Organization *
                </label>
                <Input
                  id="issuer"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleInputChange}
                  placeholder="e.g., Amazon Web Services"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date Earned *
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="credentialUrl" className="text-sm font-medium">
                  Credential URL
                </label>
                <Input
                  id="credentialUrl"
                  name="credentialUrl"
                  type="url"
                  value={formData.credentialUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/certificate"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the certification and skills demonstrated..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                {editingId ? "Update Certification" : "Add Certification"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({
                    title: "",
                    issuer: "",
                    date: "",
                    credentialUrl: "",
                    description: "",
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Certifications List */}
      <div className="space-y-4">
        {certifications.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No certifications yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first certification to showcase your expertise
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
        ) : (
          certifications.map((cert) => (
            <div
              key={cert.id}
              className="group flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                <Award className="h-6 w-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-lg truncate">{cert.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(cert.date)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    <span className="font-medium">Issued by:</span> {cert.issuer}
                  </p>
                  {cert.description && (
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View credential
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(cert)}
                  className="gap-1"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(cert.id)}
                  className="gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">{certifications.length}</div>
          <div className="text-sm text-muted-foreground">Total Certifications</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">
            {new Set(certifications.map(c => c.issuer)).size}
          </div>
          <div className="text-sm text-muted-foreground">Unique Issuers</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">
            {certifications.filter(c => c.credentialUrl).length}
          </div>
          <div className="text-sm text-muted-foreground">With Verified URLs</div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;