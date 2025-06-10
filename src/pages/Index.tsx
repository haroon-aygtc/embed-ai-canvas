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
  Monitor, Cpu, Cloud, Workflow, Gauge, Headphones, ExternalLink,
  Building, Briefcase, Heart, Quote, ChevronDown, Menu, X,
  Lightbulb, Infinity, Zap as Lightning, Verified, Trophy,
  Fingerprint, Eye, Mic, Volume2, MousePointer, Keyboard, Calendar
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 4000);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced AI models with intelligent routing, context awareness, and natural language understanding that learns from every interaction',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-blue-600 dark:text-blue-400',
      metrics: ['99.2% Accuracy', '< 200ms Response', 'Multi-language']
    },
    {
      icon: Rocket,
      title: 'Lightning Fast Setup',
      description: 'Deploy in minutes with our intuitive setup wizard, one-click integration, and zero-configuration deployment',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-600 dark:text-purple-400',
      metrics: ['5-min Setup', 'Zero Config', 'Auto Deploy']
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, SOC 2 compliance, GDPR ready, and advanced threat protection with real-time monitoring',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
      iconColor: 'text-green-600 dark:text-green-400',
      metrics: ['SOC 2 Type II', 'GDPR Compliant', '256-bit Encryption']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time insights, performance metrics, AI-powered recommendations, and predictive analytics dashboard',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-orange-600 dark:text-orange-400',
      metrics: ['Real-time Data', 'Predictive AI', 'Custom Reports']
    },
    {
      icon: Layers,
      title: 'Seamless Integration',
      description: 'Works with any platform, CMS, or framework with zero configuration and universal compatibility',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      metrics: ['500+ Platforms', 'API-First', 'Plug & Play']
    },
    {
      icon: Gauge,
      title: 'Performance Optimized',
      description: 'Sub-second response times with global CDN, intelligent caching, and edge computing infrastructure',
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50 dark:bg-teal-950',
      iconColor: 'text-teal-600 dark:text-teal-400',
      metrics: ['< 100ms Latency', 'Global CDN', '99.99% Uptime']
    }
  ];

  const stats = [
    { value: '99.99%', label: 'Uptime SLA', icon: Clock, trend: '+0.1%' },
    { value: '< 100ms', label: 'Avg Response', icon: Zap, trend: '-15ms' },
    { value: '1M+', label: 'Active Widgets', icon: Globe, trend: '+25%' },
    { value: '24/7', label: 'Expert Support', icon: Headphones, trend: 'Always' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO, TechFlow Inc.',
      company: 'TechFlow',
      content: 'ChatWidget Pro transformed our customer support completely. The AI accuracy is incredible and our response times improved by 300%. Best investment we\'ve made.',
      avatar: '👩‍💼',
      rating: 5,
      metrics: '300% faster responses'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Product, DataSync',
      company: 'DataSync',
      content: 'Setup took literally 5 minutes. The analytics dashboard gives us insights we never had before. Our conversion rate increased by 45% in the first month.',
      avatar: '👨‍💻',
      rating: 5,
      metrics: '45% conversion increase'
    },
    {
      name: 'Emily Watson',
      role: 'VP Engineering, CloudBase',
      company: 'CloudBase',
      content: 'Enterprise-grade security with consumer-grade simplicity. Perfect combination. The compliance features saved us months of work.',
      avatar: '👩‍🔬',
      rating: 5,
      metrics: 'Months of compliance work saved'
    }
  ];

  const integrations = [
    { name: 'OpenAI', logo: '🤖', status: 'active' },
    { name: 'Anthropic', logo: '🧠', status: 'active' },
    { name: 'Google AI', logo: '🔍', status: 'active' },
    { name: 'Meta AI', logo: '📘', status: 'active' },
    { name: 'Cohere', logo: '🌐', status: 'active' },
    { name: 'Hugging Face', logo: '🤗', status: 'active' },
    { name: 'Azure AI', logo: '☁️', status: 'coming-soon' },
    { name: 'AWS Bedrock', logo: '🏗️', status: 'coming-soon' }
  ];

  const certifications = [
    { name: 'SOC 2 Type II', icon: Shield },
    { name: 'GDPR Compliant', icon: Lock },
    { name: 'ISO 27001', icon: Award },
    { name: 'HIPAA Ready', icon: Verified }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-green-400/15 to-emerald-400/15 rounded-full blur-2xl animate-pulse delay-3000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-orange-400/15 to-red-400/15 rounded-full blur-2xl animate-pulse delay-4000"></div>
      </div>

      {/* Enhanced Navigation */}
      <nav className={`relative z-50 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'} ${scrollY > 50 ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-border/50' : ''}`}>
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white dark:border-slate-900"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ChatWidget Pro
                </span>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-muted-foreground font-medium">Enterprise Platform</div>
                  <Badge variant="outline" className="text-xs px-2 py-0">v2.0</Badge>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Button variant="ghost" className="group">
                Features
                <ChevronDown className="h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200" />
              </Button>
              <Button variant="ghost">Pricing</Button>
              <Button variant="ghost">Documentation</Button>
              <Button variant="ghost">Support</Button>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" className="hidden md:flex group" onClick={() => navigate('/setup')}>
                <Sparkles className="h-4 w-4 mr-2 group-hover:animate-spin" />
                Setup Wizard
              </Button>
              <Button onClick={() => navigate('/dashboard/widget')} className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-6 pb-6 border-t border-border/50 pt-6">
              <div className="flex flex-col space-y-4">
                <Button variant="ghost" className="justify-start">Features</Button>
                <Button variant="ghost" className="justify-start">Pricing</Button>
                <Button variant="ghost" className="justify-start">Documentation</Button>
                <Button variant="ghost" className="justify-start">Support</Button>
                <Button variant="outline" className="justify-start" onClick={() => navigate('/setup')}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Setup Wizard
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className={`relative z-40 pt-20 pb-32 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-5xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-full px-6 py-2 mb-8 group hover:shadow-lg transition-all duration-300">
              <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                New: Advanced AI Models & Real-time Analytics
              </span>
              <Badge variant="secondary" className="text-xs">v2.0</Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent">
                Transform Customer
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                Engagement Forever
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Deploy enterprise-grade AI chat widgets in minutes. Powered by the latest AI models with
              <span className="font-semibold text-foreground"> 99.99% uptime</span>,
              <span className="font-semibold text-foreground"> sub-100ms responses</span>, and
              <span className="font-semibold text-foreground"> bank-grade security</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                onClick={() => navigate('/dashboard/widget')}
              >
                <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                Start Building Now
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group border-2 hover:bg-muted/50 text-lg px-8 py-6"
                onClick={() => navigate('/setup')}
              >
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>5-minute setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Enterprise support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section className={`relative z-30 py-20 transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  <div className="text-xs text-green-600 mt-1 font-medium">{stat.trend}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className={`relative z-30 py-32 transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Lightbulb className="h-4 w-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Everything you need to
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                succeed with AI
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for enterprise scale with features that grow with your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg ${activeFeature === index ? 'ring-2 ring-blue-500 shadow-xl scale-105' : ''
                  }`}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{metric}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Provider Integrations */}
      <section className="relative z-30 py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              AI Integrations
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by the <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">best AI models</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose from industry-leading AI providers or use multiple models simultaneously
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {integration.logo}
                  </div>
                  <div className="text-sm font-medium mb-2">{integration.name}</div>
                  <Badge
                    variant={integration.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {integration.status === 'active' ? 'Active' : 'Coming Soon'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="relative z-30 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Heart className="h-4 w-4 mr-2" />
              Customer Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Loved by teams at
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                innovative companies
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs text-blue-600 font-medium mt-1">{testimonial.metrics}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative z-30 py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Ready to transform your
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                customer experience?
              </span>
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join thousands of companies already using ChatWidget Pro to deliver exceptional customer experiences
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button
                size="lg"
                className="group bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6"
                onClick={() => navigate('/dashboard/widget')}
              >
                <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-30 bg-slate-900 dark:bg-slate-950 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">ChatWidget Pro</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Enterprise-grade AI chat widgets that transform customer engagement and drive business growth.
              </p>
              <div className="flex space-x-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-slate-400">
                    <cert.icon className="h-4 w-4" />
                    <span>{cert.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold mb-6">Product</h4>
              <div className="space-y-3">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Features</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Pricing</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Integrations</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">API</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Changelog</a>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-6">Company</h4>
              <div className="space-y-3">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">About</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Blog</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Careers</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Press</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Partners</a>
              </div>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold mb-6">Support</h4>
              <div className="space-y-3">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Documentation</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Help Center</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Community</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Status</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors duration-200">Contact</a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2024 ChatWidget Pro. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
