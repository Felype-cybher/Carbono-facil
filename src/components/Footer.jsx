import React from 'react';
import { Leaf, Twitter, Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, href: '#' },
    { icon: Github, href: '#' },
    { icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-background/50 border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 eco-gradient rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">EcoTracker</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EcoTracker. Todos os direitos reservados.
          </p>

          <div className="flex items-center space-x-4">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{ scale: 1.2, color: 'hsl(var(--primary))' }}
                  className="text-muted-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;