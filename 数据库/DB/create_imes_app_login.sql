-- Dedicated SQL Server login for the MES application.
--
-- Run this script after the iMES database has been created/imported.
-- The password must be supplied through sqlcmd:
--
-- sqlcmd -S <server> -U sa -P <sa-password> -C -b ^
--   -v APP_PASSWORD="<strong-random-password>" ^
--   -i create_imes_app_login.sql

IF DB_ID(N'iMES') IS NULL
BEGIN
    THROW 50000, 'Database iMES does not exist. Import iMES before creating the application login.', 1;
END
GO

IF EXISTS (
    SELECT 1
    FROM sys.server_principals
    WHERE name = N'imes_app'
)
BEGIN
    ALTER LOGIN [imes_app]
    WITH PASSWORD = '$(APP_PASSWORD)',
         CHECK_POLICY = ON,
         CHECK_EXPIRATION = OFF;
END
ELSE
BEGIN
    CREATE LOGIN [imes_app]
    WITH PASSWORD = '$(APP_PASSWORD)',
         CHECK_POLICY = ON,
         CHECK_EXPIRATION = OFF;
END
GO

USE [iMES];
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.database_principals
    WHERE name = N'imes_app'
)
BEGIN
    CREATE USER [imes_app] FOR LOGIN [imes_app];
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.database_principals
    WHERE name = N'imes_app_role'
      AND type = 'R'
)
BEGIN
    CREATE ROLE [imes_app_role];
END
GO

GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE
TO [imes_app_role];
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.database_role_members drm
    INNER JOIN sys.database_principals r
        ON drm.role_principal_id = r.principal_id
    INNER JOIN sys.database_principals m
        ON drm.member_principal_id = m.principal_id
    WHERE r.name = N'imes_app_role'
      AND m.name = N'imes_app'
)
BEGIN
    ALTER ROLE [imes_app_role] ADD MEMBER [imes_app];
END
GO