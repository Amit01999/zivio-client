import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

export default function Testimonial() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-gradient-to-br from-primary-soft via-accent-light to-primary-soft/50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-slide-down">
            <Quote className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Testimonials
            </span>
          </div>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-slide-up">
            What Our Users Say
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Trusted by thousands of property seekers across Bangladesh
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              name: 'Rashid Ahmed',
              role: 'Home Buyer',
              content:
                'Found my dream apartment in Gulshan within a week. The verified listings feature gave me confidence in my purchase.',
              rating: 5,
              avatar: 'RA',
            },
            {
              name: 'Fatima Rahman',
              role: 'Property Investor',
              content:
                'Best platform for real estate in Bangladesh. The agent verification process ensures I only deal with professionals.',
              rating: 5,
              avatar: 'FR',
            },
            {
              name: 'Kamal Hossain',
              role: 'Landlord',
              content:
                'Listed my property and got quality tenants within days. The featured listing option really works!',
              rating: 5,
              avatar: 'KH',
            },
          ].map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className="group relative overflow-hidden border-0 bg-white dark:bg-card shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

              {/* Quote icon decoration */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <Quote className="w-16 h-16 text-primary" />
              </div>

              <CardContent className="relative p-6 md:p-8">
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-amber-500 fill-amber-500 animate-scale-in"
                      style={{ animationDelay: `${(index * 100) + (i * 50)}ms` }}
                    />
                  ))}
                </div>

                {/* Testimonial Content */}
                <p className="text-muted-foreground leading-relaxed mb-6 italic relative z-10">
                  "{testimonial.content}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold shadow-md group-hover:scale-110 transition-transform duration-500">
                    {testimonial.avatar}
                  </div>

                  {/* Name and Role */}
                  <div className="flex-1">
                    <p className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>

                  {/* Decorative element */}
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
              </CardContent>

              {/* Bottom gradient accent */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          ))}
        </div>

        {/* Bottom CTA or decorative element */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="inline-flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-primary/50" />
            <span>Join thousands of satisfied users</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent via-primary to-primary/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
