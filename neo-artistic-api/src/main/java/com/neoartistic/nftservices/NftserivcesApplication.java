package com.neoartistic.nftservices;

import java.util.Collections;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NftserivcesApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(NftserivcesApplication.class);
        app.setDefaultProperties(Collections
          .singletonMap("server.port", "9999"));
        app.run(args);
	}

}
