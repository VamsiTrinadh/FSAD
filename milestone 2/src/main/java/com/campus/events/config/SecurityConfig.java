package com.campus.events.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disabled for simplicity in REST APIs if needed, but better to keep for forms. Disabling for now as it's a simple project
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/events/**", "/register/**", "/api/events/**", "/css/**", "/js/**", "/h2-console/**").permitAll()
                .requestMatchers("/admin/**").authenticated()
                .anyRequest().permitAll()
            )
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/admin/dashboard", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/")
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails admin = User.builder()
            .username(adminUsername)
            .password("{noop}" + adminPassword) // {noop} means plain text password
            .roles("ADMIN")
            .build();

        return new InMemoryUserDetailsManager(admin);
    }
}
