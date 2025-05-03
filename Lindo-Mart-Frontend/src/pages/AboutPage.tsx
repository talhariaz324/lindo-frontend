
import React from 'react';
import Layout from '@/components/Layout';

const AboutPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Lindo Mart
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Empowering retail operations with efficient process management
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-4 text-lg text-gray-500">
                At Lindo Mart, our mission is to streamline retail operations by providing a robust workflow management system. We believe that efficient processes lead to better business outcomes, happier employees, and satisfied customers.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                Our platform is designed to eliminate paperwork, reduce errors, and provide real-time insights into operational processes. By digitizing forms and automating notifications, we help retailers focus on what matters most - serving their customers.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Approach</h2>
              <p className="mt-4 text-lg text-gray-500">
                We take a user-centered approach to design and development, creating intuitive interfaces that require minimal training. Our forms are tailored to the specific needs of retail operations, covering everything from inventory management to equipment issues and customer feedback.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                Our development team works closely with retail professionals to ensure that our platform addresses real-world challenges and delivers meaningful improvements to daily operations.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Our Values</h2>
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-brand-blue">Efficiency</h3>
                <p className="mt-2 text-base text-gray-500">
                  We believe in doing more with less. Our platform is designed to save time and reduce effort in managing retail operations.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-brand-blue">Transparency</h3>
                <p className="mt-2 text-base text-gray-500">
                  Clear communication and visibility into processes are essential for effective team collaboration and accountability.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-brand-blue">Continuous Improvement</h3>
                <p className="mt-2 text-base text-gray-500">
                  We are committed to constantly enhancing our platform based on user feedback and evolving retail needs.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Our Team</h2>
            <p className="mt-4 text-lg text-gray-500">
              Our team consists of experienced professionals from retail operations, software development, and user experience design. This diverse expertise allows us to create solutions that are both technically robust and practically valuable.
            </p>
            <p className="mt-4 text-lg text-gray-500">
              We are passionate about helping retail businesses thrive through better processes and are dedicated to providing exceptional support to our users.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
