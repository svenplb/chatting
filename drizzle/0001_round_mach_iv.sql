CREATE TABLE "fuckdiscord_post" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "fuckdiscord_post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "fuckdiscord_user" DROP CONSTRAINT "fuckdiscord_user_username_unique";--> statement-breakpoint
ALTER TABLE "fuckdiscord_message" DROP CONSTRAINT "fuckdiscord_message_userId_fuckdiscord_user_id_fk";
--> statement-breakpoint
ALTER TABLE "fuckdiscord_message" DROP CONSTRAINT "fuckdiscord_message_channelId_fuckdiscord_channel_id_fk";
--> statement-breakpoint
ALTER TABLE "fuckdiscord_channel" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "fuckdiscord_channel" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "fuckdiscord_channel" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (sequence name "fuckdiscord_channel_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "fuckdiscord_message" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "fuckdiscord_message" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "fuckdiscord_message" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (sequence name "fuckdiscord_message_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "fuckdiscord_message" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "fuckdiscord_message" ALTER COLUMN "channelId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "fuckdiscord_user" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "fuckdiscord_user" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "fuckdiscord_user" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (sequence name "fuckdiscord_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "fuckdiscord_user" ALTER COLUMN "color" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "fuckdiscord_user" ALTER COLUMN "color" SET DEFAULT 'text-blue-400';--> statement-breakpoint
CREATE INDEX "name_idx" ON "fuckdiscord_post" USING btree ("name");--> statement-breakpoint
ALTER TABLE "fuckdiscord_message" ADD CONSTRAINT "fuckdiscord_message_userId_fuckdiscord_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."fuckdiscord_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fuckdiscord_message" ADD CONSTRAINT "fuckdiscord_message_channelId_fuckdiscord_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."fuckdiscord_channel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fuckdiscord_channel" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "fuckdiscord_message" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "fuckdiscord_user" DROP COLUMN "updatedAt";