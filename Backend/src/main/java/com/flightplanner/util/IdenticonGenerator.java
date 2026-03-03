package com.flightplanner.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Generates SVG identicon avatars based on a hash of the input string.
 * Creates a 5x5 symmetric grid pattern with colors derived from the hash.
 */
public class IdenticonGenerator {

    private static final int GRID_SIZE = 5;
    private static final int CELL_SIZE = 50;
    private static final int IMAGE_SIZE = GRID_SIZE * CELL_SIZE;

    /**
     * Generate an SVG identicon for the given seed (typically email or ID).
     *
     * @param seed The string to generate the identicon from
     * @return SVG string
     */
    public static String generateSvg(String seed) {
        byte[] hash = md5(seed);

        // Extract color from first 3 bytes of hash
        int r = hash[0] & 0xFF;
        int g = hash[1] & 0xFF;
        int b = hash[2] & 0xFF;

        // Ensure color is not too light (for visibility on white background)
        if (r + g + b > 600) {
            r = (int) (r * 0.7);
            g = (int) (g * 0.7);
            b = (int) (b * 0.7);
        }

        String foregroundColor = String.format("#%02x%02x%02x", r, g, b);
        String backgroundColor = "#f1f5f9"; // Tailwind slate-100

        StringBuilder svg = new StringBuilder();
        svg.append(String.format(
                "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"%d\" height=\"%d\" viewBox=\"0 0 %d %d\">",
                IMAGE_SIZE, IMAGE_SIZE, IMAGE_SIZE, IMAGE_SIZE));
        svg.append(String.format("<rect width=\"%d\" height=\"%d\" fill=\"%s\"/>",
                IMAGE_SIZE, IMAGE_SIZE, backgroundColor));

        // Generate symmetric 5x5 grid pattern
        // We only need to calculate the left half (3 columns) since it's mirrored
        for (int row = 0; row < GRID_SIZE; row++) {
            for (int col = 0; col < 3; col++) {
                // Use different bytes from hash for each cell
                int hashIndex = (row * 3 + col + 3) % hash.length;
                boolean filled = (hash[hashIndex] & 0xFF) > 127;

                if (filled) {
                    // Draw left side
                    int x = col * CELL_SIZE;
                    int y = row * CELL_SIZE;
                    svg.append(String.format("<rect x=\"%d\" y=\"%d\" width=\"%d\" height=\"%d\" fill=\"%s\"/>",
                            x, y, CELL_SIZE, CELL_SIZE, foregroundColor));

                    // Draw mirrored right side (except center column)
                    if (col < 2) {
                        int mirrorX = (GRID_SIZE - 1 - col) * CELL_SIZE;
                        svg.append(String.format("<rect x=\"%d\" y=\"%d\" width=\"%d\" height=\"%d\" fill=\"%s\"/>",
                                mirrorX, y, CELL_SIZE, CELL_SIZE, foregroundColor));
                    }
                }
            }
        }

        svg.append("</svg>");
        return svg.toString();
    }

    /**
     * Generate SVG identicon as bytes.
     */
    public static byte[] generateSvgBytes(String seed) {
        return generateSvg(seed).getBytes(StandardCharsets.UTF_8);
    }

    private static byte[] md5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            return md.digest(input.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            // MD5 is always available, but fall back to simple hash if somehow not
            byte[] fallback = new byte[16];
            int hash = input.hashCode();
            for (int i = 0; i < 16; i++) {
                fallback[i] = (byte) ((hash >> (i % 4 * 8)) & 0xFF);
                hash = hash * 31 + input.charAt(i % input.length());
            }
            return fallback;
        }
    }
}
