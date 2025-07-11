CREATE TABLE "fuckdiscord_channel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(20) DEFAULT 'text' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "fuckdiscord_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"userId" uuid NOT NULL,
	"channelId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "fuckdiscord_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(100) NOT NULL,
	"avatar" varchar(255),
	"color" varchar(7),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "fuckdiscord_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "fuckdiscord_message" ADD CONSTRAINT "fuckdiscord_message_userId_fuckdiscord_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."fuckdiscord_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fuckdiscord_message" ADD CONSTRAINT "fuckdiscord_message_channelId_fuckdiscord_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."fuckdiscord_channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "channel_name_idx" ON "fuckdiscord_channel" USING btree ("name");--> statement-breakpoint
CREATE INDEX "message_user_idx" ON "fuckdiscord_message" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "message_channel_idx" ON "fuckdiscord_message" USING btree ("channelId");--> statement-breakpoint
CREATE INDEX "message_created_idx" ON "fuckdiscord_message" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "username_idx" ON "fuckdiscord_user" USING btree ("username");