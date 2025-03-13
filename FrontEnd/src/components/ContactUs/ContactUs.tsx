import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";


const ContactUs = () => {
    const [contactForm,setContactForm] = useState({
        name: "",
        email: "",
        message: ""
    });

  return (
    <main className="min-h-screen w-full bg-white" id="contactUs">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-blue-200 to-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about how you can help? We&apos;d love to hear from you.
            Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </section>
      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white px-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="name"
                  >
                    Your Name
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="name"
                    placeholder="John Doe"
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="email"
                    placeholder="john@example.com"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="message"
                    placeholder="How can we help you?"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  />
                </div>
                <button
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                  type="submit"
                >
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </button>
              </form>
            </div>
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      icon: <Mail className="h-5 w-5 text-blue-500" />,
                      title: "Email",
                      content: "contact@charity.org",
                    },
                    {
                      icon: <Phone className="h-5 w-5 text-blue-500" />,
                      title: "Phone",
                      content: "+1 (555) 123-4567",
                    },
                    {
                      icon: <MapPin className="h-5 w-5 text-blue-500" />,
                      title: "Address",
                      content: "123 Charity Street, City, Country",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* FAQ Preview */}
              <div className="bg-blue-50 p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">
                  Frequently Asked Questions
                </h3>
                <ul className="space-y-3">
                  <li className="text-gray-600">
                    How can I start volunteering?
                  </li>
                  <li className="text-gray-600">
                    What types of donations do you accept?
                  </li>
                  <li className="text-gray-600">How is my donation used?</li>
                </ul>
                <button className="mt-4 text-blue-500 font-medium hover:text-blue-600 transition-colors">
                  View all FAQs →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ContactUs;