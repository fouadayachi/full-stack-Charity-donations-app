import React, { useState } from 'react'
import { toast } from 'react-toastify';

const NewsletterForm = () => {
  const [email,setEmail] = useState("")
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEmail("");
        toast.success("You have successfully subscribed to the newsletter!");
      };
      
      return (
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block text-lg font-medium" htmlFor="email">
            Newsletter
          </label>
          <div className="flex gap-2">
            <input
              required
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              id="email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-yellow-400 text-[#003366] font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-200"
              type="submit"
            >
              Subscribe
            </button>
          </div>
        </form>
      );
}

export default NewsletterForm