import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Zap, Bot, Code, BarChart3, Shield, Smartphone, Sparkles,
  ArrowRight, CheckCircle, Star, Users, Globe, Rocket,
  MessageSquare, Settings, Database, Brain, Target, TrendingUp,
  Play, ChevronRight, Award, Clock, Lock, Layers, Palette,
  Monitor, Cpu, Cloud, Workflow, Gauge, Headphones
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced AI models with intelligent routing, context awareness, and natural language understanding',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Rocket,
      title: 'Lightning Fast Setup',
      description: 'Deploy in minutes with our intuitive setup wizard and one-click integration',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, SOC 2 compliance, and advanced threat protection',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time insights, performance metrics, and AI-powered recommendations',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      icon: Layers,
      title: 'Seamless Integration',
      description: 'Works with any platform, CMS, or framework with zero configuration',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      icon: Gauge,
      title: 'Performance Optimized',
      description: 'Sub-second response times with global CDN and intelligent caching',
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50 dark:bg-teal-950',
      iconColor: 'text-teal-600 dark:text-teal-400'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime SLA', icon: Clock },
    { value: '500ms', label: 'Avg Response', icon: Zap },
    { value: '50K+', label: 'Active Widgets', icon: Globe },
    { value: '24/7', label: 'Support', icon: Headphones }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO, TechFlow',
      content: 'ChatWidget Pro transformed our customer support. The AI accuracy is incredible.',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Product, DataSync',
      content: 'Setup took 5 minutes. The analytics dashboard gives us insights we never had before.',
      avatar: '👨‍💻',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'VP Engineering, CloudBase',
      content: 'Enterprise-grade security with consumer-grade simplicity. Perfect combination.',
      avatar: '👩‍🔬',
      rating: 5
    }
  ];

  const integrations = [
    { name: 'OpenAI', logo: '🤖' },
    { name: 'Anthropic', logo: '🧠' },
    { name: 'Google AI', logo: '🔍' },
    { name: 'Meta AI', logo: '📘' },
    { name: 'Cohere', logo: '🌐' },
    { name: 'Hugging Face', logo: '🤗' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className={`relative z-50 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ChatWidget Pro
                </span>
                <div className="text-xs text-muted-foreground font-medium">Enterprise Platform</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" className="hidden md:flex">
                Features
              </Button>
              <Button variant="ghost" className="hidden md:flex">
                Pricing
              </Button>
              <Button variant="outline" onClick={() => navigate('/setup')} className="group">
                <Sparkles className="h-4 w-4 mr-2 group-hover:animate-spin" />
                Setup Wizard
              </Button>
              <Button onClick={() => navigate('/dashboard/widget')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Dashboard
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-all duration-300">
            <Sparkles className="h-3 w-3 mr-1" />
            New: Advanced AI Knowledge Base
          </Badge>

          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Enterprise AI Chat
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">
              Widgets Reimagined
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-4xl mx-auto">
            Build, customize, and deploy AI-powered chat widgets with{' '}
            <span className="text-blue-600 font-semibold">multiple provider support</span>,{' '}
            <span className="text-purple-600 font-semibold">real-time configuration</span>, and{' '}
            <span className="text-cyan-600 font-semibold">enterprise-grade security</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate('/setup')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 group shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/dashboard/widget')}
              className="text-lg px-8 py-4 group border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className={`transition-all duration-500 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                <div className="flex flex-col items-center space-y-2">
                  <stat.icon className="h-8 w-8 text-blue-600 mb-2" />
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className={`text-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Everything You Need
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A complete platform for building and managing AI chat widgets with enterprise-grade features and consumer-grade simplicity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`group hover:shadow-2xl transition-all duration-500 delay-${index * 100} border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105 cursor-pointer ${activeFeature === index ? 'ring-2 ring-blue-500 shadow-xl scale-105' : ''
                } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <CardContent className="p-8">
                <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                  Learn more
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Integrations Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
            Powered by Leading AI Providers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seamlessly integrate with the world's most advanced AI models
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="text-2xl">{integration.logo}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{integration.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our customers are saying about ChatWidget Pro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-16 text-center text-white relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Customer Experience?
              </h2>
              <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Join thousands of businesses using ChatWidget Pro to enhance their customer support,
                increase engagement, and drive growth with AI-powered conversations.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/setup')}
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 group shadow-xl"
                >
                  <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/dashboard/widget')}
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 group"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Full Dashboard
                </Button>
              </div>
              <div className="mt-8 text-sm opacity-75">
                No credit card required • 14-day free trial • Cancel anytime
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">ChatWidget Pro</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span>© 2024 ChatWidget Pro</span>
            <span>•</span>
            <span>Built with ❤️ for the enterprise</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4" />
              <span>SOC 2 Certified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
